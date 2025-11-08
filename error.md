the deploy workflow for github is failing, in the following you will find the logs find a solution to the problem also there is an idea/recommendation as an solution think about it if it is a good solution and fix the error.

**Solution Idea**:
GitHub Copilot Chat Assistant

Failure summary
- Root cause: buildx failed because the base image node:lts-slim has no manifest for linux/arm/v7. From the job logs: "failed to resolve source metadata for docker.io/library/node:lts-slim: no match for platform in manifest: not found".
- Secondary/transient error: a BuildKit lock message appeared, but the build-stop is the platform mismatch for node:lts-slim.

Quick fixes (pick one depending on whether you need arm/v7 support)

1) Quick/Recommended (if you do NOT need arm/v7)
- Remove linux/arm/v7 from the buildx platforms so the runner only builds architectures the base image supports (amd64 and arm64).
- Change two places in your workflow (.github/workflows/deploy.yml at ref e0ff6d7537b297a3aef9cf485f7c4b644953faf0):
  - Replace platforms under setup-buildx (line ~42)
  - Replace platforms under build-push-action (line ~63)

Example change:
- .github/workflows/deploy.yml (replace the platforms lines)
  - Old:
    platforms: linux/amd64,linux/arm64,linux/arm/v7
  - New:
    platforms: linux/amd64,linux/arm64

This removes the failing platform and will let buildx pull node:lts-slim successfully. See the file at:
https://github.com/QuantomDevs/QuantomOS/blob/e0ff6d7537b297a3aef9cf485f7c4b644953faf0/.github/workflows/deploy.yml

2) Keep arm/v7 builds (if you DO need linux/arm/v7)
You must ensure the Dockerfile uses a base image that actually provides an arm/v7 image or build platform-specific images. Two common approaches:

A — Use an arm32v7 base image for arm/v7 via a per-platform matrix build
- Make the Dockerfile accept a build ARG for the node base image and use it in FROM:

Dockerfile (snippet)
ARG NODE_IMAGE=node:lts-slim
FROM ${NODE_IMAGE} AS frontend-build
WORKDIR /usr/src/app
# ...rest of Dockerfile...

- Modify your workflow to run a matrix build where the arm/v7 platform uses arm32v7/node:lts-slim while amd64 and arm64 use node:lts-slim. Example (replace your single publish job with a matrix build job):

.github/workflows/deploy.yml (build job snippet)
jobs:
  publish:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        include:
          - platform: linux/amd64
            node_image: node:lts-slim
          - platform: linux/arm64
            node_image: node:lts-slim
          - platform: linux/arm/v7
            node_image: arm32v7/node:lts-slim
    steps:
      - uses: actions/checkout@v4
      - name: Set up QEMU
        uses: docker/setup-qemu-action@v3
      - name: Set up Buildx
        uses: docker/setup-buildx-action@v3
        with:
          platforms: ${{ matrix.platform }}
      - name: Build & Push
        uses: docker/build-push-action@v5
        with:
          context: .
          push: true
          platforms: ${{ matrix.platform }}
          build-args: |
            NODE_IMAGE=${{ matrix.node_image }}
          tags: |
            ghcr.io/${{ github.repository | toLowerCase }}:latest
            ghcr.io/${{ github.repository | toLowerCase }}:v${{ steps.version_check.outputs.rawVersion }}

Notes:
- The Dockerfile reads NODE_IMAGE as the base. For arm/v7 the workflow sets node_image: arm32v7/node:lts-slim (official multiarch namespace on Docker Hub).
- This builds each platform in separate buildx invocations, using the correct base image for each.

B — Use an official node tag that includes arm/v7 (if you can find one)
- If you identify a specific node tag that advertises support for linux/arm/v7, update the Dockerfile base FROM to that tag. Confirm support on Docker Hub before switching.

Other practical tips
- Confirm base image support with `docker manifest inspect node:lts-slim` locally or check the image tags on Docker Hub to confirm which architectures are provided.
- The BuildKit "locked" message in logs is typically transient; re-running the workflow can sometimes clear transient buildkit issues. But do not rely on re-runs to fix the platform mismatch.
- If you only need one or two architectures for your consumers, building fewer targets reduces CI time and avoids incompatible base image problems.

Files to edit
- .github/workflows/deploy.yml (ref e0ff6d7537b297a3aef9cf485f7c4b644953faf0): adjust platforms or switch to a matrix build that supplies platform-appropriate base images.
- Dockerfile: add ARG NODE_IMAGE and use FROM ${NODE_IMAGE} if using the matrix approach.

If you want, I can:
- Produce a ready-to-apply patch for .github/workflows/deploy.yml and the Dockerfile (showing exact diffs) for either the quick removal of arm/v7 or the matrix build solution. Which option do you want applied?






**LOgs**:
2025-11-07T22:18:56.3340421Z Current runner version: '2.329.0'
2025-11-07T22:18:56.3374016Z ##[group]Runner Image Provisioner
2025-11-07T22:18:56.3375394Z Hosted Compute Agent
2025-11-07T22:18:56.3376376Z Version: 20251016.436
2025-11-07T22:18:56.3377419Z Commit: 8ab8ac8bfd662a3739dab9fe09456aba92132568
2025-11-07T22:18:56.3378529Z Build Date: 2025-10-15T20:44:12Z
2025-11-07T22:18:56.3379663Z ##[endgroup]
2025-11-07T22:18:56.3380589Z ##[group]Operating System
2025-11-07T22:18:56.3381838Z Ubuntu
2025-11-07T22:18:56.3382564Z 24.04.3
2025-11-07T22:18:56.3383442Z LTS
2025-11-07T22:18:56.3384142Z ##[endgroup]
2025-11-07T22:18:56.3384939Z ##[group]Runner Image
2025-11-07T22:18:56.3386085Z Image: ubuntu-24.04
2025-11-07T22:18:56.3386929Z Version: 20251030.96.2
2025-11-07T22:18:56.3388895Z Included Software: https://github.com/actions/runner-images/blob/ubuntu24/20251030.96/images/ubuntu/Ubuntu2404-Readme.md
2025-11-07T22:18:56.3392004Z Image Release: https://github.com/actions/runner-images/releases/tag/ubuntu24%2F20251030.96
2025-11-07T22:18:56.3393674Z ##[endgroup]
2025-11-07T22:18:56.3395974Z ##[group]GITHUB_TOKEN Permissions
2025-11-07T22:18:56.3398727Z Attestations: write
2025-11-07T22:18:56.3400140Z Contents: write
2025-11-07T22:18:56.3400913Z Metadata: read
2025-11-07T22:18:56.3401988Z Packages: write
2025-11-07T22:18:56.3402843Z ##[endgroup]
2025-11-07T22:18:56.3406010Z Secret source: Actions
2025-11-07T22:18:56.3407187Z Prepare workflow directory
2025-11-07T22:18:56.4089029Z Prepare all required actions
2025-11-07T22:18:56.4147549Z Getting action download info
2025-11-07T22:18:57.0286385Z Download action repository 'actions/checkout@v4' (SHA:08eba0b27e820071cde6df949e0beb9ba4906955)
2025-11-07T22:18:57.2489240Z Download action repository 'actions/setup-node@v4' (SHA:49933ea5288caeca8642d1e84afbd3f7d6820020)
2025-11-07T22:18:57.3520911Z Download action repository 'thebongy/version-check@v2' (SHA:8bf18831d65669fd9d94a38d2ea0a2863fbb0a4d)
2025-11-07T22:18:58.1786460Z Download action repository 'docker/setup-qemu-action@v3' (SHA:c7c53464625b32c7a7e944ae62b3e17d2b600130)
2025-11-07T22:18:59.0984161Z Download action repository 'docker/setup-buildx-action@v3' (SHA:e468171a9de216ec08956ac3ada2f0791b6bd435)
2025-11-07T22:19:00.0776197Z Download action repository 'docker/login-action@v3' (SHA:5e57cd118135c172c3672efd75eb46360885c0ef)
2025-11-07T22:19:01.0523923Z Download action repository 'docker/build-push-action@v5' (SHA:ca052bb54ab0790a636c9b5f226502c73d547a25)
2025-11-07T22:19:01.9349580Z Download action repository 'AButler/upload-release-assets@v2.0' (SHA:ec6d3263266dc57eb6645b5f75e827987f7c217d)
2025-11-07T22:19:04.4164569Z Complete job name: publish
2025-11-07T22:19:04.4881667Z ##[group]Run actions/checkout@v4
2025-11-07T22:19:04.4882300Z with:
2025-11-07T22:19:04.4882493Z   fetch-depth: 0
2025-11-07T22:19:04.4882715Z   repository: QuantomDevs/QuantomOS
2025-11-07T22:19:04.4883170Z   token: ***
2025-11-07T22:19:04.4883366Z   ssh-strict: true
2025-11-07T22:19:04.4883551Z   ssh-user: git
2025-11-07T22:19:04.4883754Z   persist-credentials: true
2025-11-07T22:19:04.4883971Z   clean: true
2025-11-07T22:19:04.4884163Z   sparse-checkout-cone-mode: true
2025-11-07T22:19:04.4884393Z   fetch-tags: false
2025-11-07T22:19:04.4884575Z   show-progress: true
2025-11-07T22:19:04.4884758Z   lfs: false
2025-11-07T22:19:04.4884918Z   submodules: false
2025-11-07T22:19:04.4885103Z   set-safe-directory: true
2025-11-07T22:19:04.4885586Z ##[endgroup]
2025-11-07T22:19:04.6068067Z Syncing repository: QuantomDevs/QuantomOS
2025-11-07T22:19:04.6070975Z ##[group]Getting Git version info
2025-11-07T22:19:04.6072239Z Working directory is '/home/runner/work/QuantomOS/QuantomOS'
2025-11-07T22:19:04.6076367Z [command]/usr/bin/git version
2025-11-07T22:19:04.6159221Z git version 2.51.2
2025-11-07T22:19:04.6189598Z ##[endgroup]
2025-11-07T22:19:04.6217716Z Temporarily overriding HOME='/home/runner/work/_temp/c49e1c1c-ff77-4ca5-9deb-4befead160ab' before making global git config changes
2025-11-07T22:19:04.6220652Z Adding repository directory to the temporary git global config as a safe directory
2025-11-07T22:19:04.6226526Z [command]/usr/bin/git config --global --add safe.directory /home/runner/work/QuantomOS/QuantomOS
2025-11-07T22:19:04.6268805Z Deleting the contents of '/home/runner/work/QuantomOS/QuantomOS'
2025-11-07T22:19:04.6273520Z ##[group]Initializing the repository
2025-11-07T22:19:04.6278910Z [command]/usr/bin/git init /home/runner/work/QuantomOS/QuantomOS
2025-11-07T22:19:04.6383893Z hint: Using 'master' as the name for the initial branch. This default branch name
2025-11-07T22:19:04.6386534Z hint: is subject to change. To configure the initial branch name to use in all
2025-11-07T22:19:04.6387399Z hint: of your new repositories, which will suppress this warning, call:
2025-11-07T22:19:04.6388012Z hint:
2025-11-07T22:19:04.6388441Z hint: 	git config --global init.defaultBranch <name>
2025-11-07T22:19:04.6389227Z hint:
2025-11-07T22:19:04.6389699Z hint: Names commonly chosen instead of 'master' are 'main', 'trunk' and
2025-11-07T22:19:04.6390483Z hint: 'development'. The just-created branch can be renamed via this command:
2025-11-07T22:19:04.6391151Z hint:
2025-11-07T22:19:04.6391815Z hint: 	git branch -m <name>
2025-11-07T22:19:04.6392218Z hint:
2025-11-07T22:19:04.6392756Z hint: Disable this message with "git config set advice.defaultBranchName false"
2025-11-07T22:19:04.6394338Z Initialized empty Git repository in /home/runner/work/QuantomOS/QuantomOS/.git/
2025-11-07T22:19:04.6406947Z [command]/usr/bin/git remote add origin https://github.com/QuantomDevs/QuantomOS
2025-11-07T22:19:04.6466900Z ##[endgroup]
2025-11-07T22:19:04.6468877Z ##[group]Disabling automatic garbage collection
2025-11-07T22:19:04.6473206Z [command]/usr/bin/git config --local gc.auto 0
2025-11-07T22:19:04.6508110Z ##[endgroup]
2025-11-07T22:19:04.6509588Z ##[group]Setting up auth
2025-11-07T22:19:04.6516107Z [command]/usr/bin/git config --local --name-only --get-regexp core\.sshCommand
2025-11-07T22:19:04.6551048Z [command]/usr/bin/git submodule foreach --recursive sh -c "git config --local --name-only --get-regexp 'core\.sshCommand' && git config --local --unset-all 'core.sshCommand' || :"
2025-11-07T22:19:04.7007807Z [command]/usr/bin/git config --local --name-only --get-regexp http\.https\:\/\/github\.com\/\.extraheader
2025-11-07T22:19:04.7020869Z [command]/usr/bin/git submodule foreach --recursive sh -c "git config --local --name-only --get-regexp 'http\.https\:\/\/github\.com\/\.extraheader' && git config --local --unset-all 'http.https://github.com/.extraheader' || :"
2025-11-07T22:19:04.7262830Z [command]/usr/bin/git config --local http.https://github.com/.extraheader AUTHORIZATION: basic ***
2025-11-07T22:19:04.7311074Z ##[endgroup]
2025-11-07T22:19:04.7313646Z ##[group]Fetching the repository
2025-11-07T22:19:04.7320908Z [command]/usr/bin/git -c protocol.version=2 fetch --prune --no-recurse-submodules origin +refs/heads/*:refs/remotes/origin/* +refs/tags/*:refs/tags/*
2025-11-07T22:19:08.1565795Z From https://github.com/QuantomDevs/QuantomOS
2025-11-07T22:19:08.1572995Z  * [new branch]      main       -> origin/main
2025-11-07T22:19:08.1616241Z [command]/usr/bin/git branch --list --remote origin/main
2025-11-07T22:19:08.1640474Z   origin/main
2025-11-07T22:19:08.1662470Z [command]/usr/bin/git rev-parse refs/remotes/origin/main
2025-11-07T22:19:08.1681071Z e0ff6d7537b297a3aef9cf485f7c4b644953faf0
2025-11-07T22:19:08.1688165Z ##[endgroup]
2025-11-07T22:19:08.1689747Z ##[group]Determining the checkout info
2025-11-07T22:19:08.1690869Z ##[endgroup]
2025-11-07T22:19:08.1695519Z [command]/usr/bin/git sparse-checkout disable
2025-11-07T22:19:08.1753750Z [command]/usr/bin/git config --local --unset-all extensions.worktreeConfig
2025-11-07T22:19:08.1786162Z ##[group]Checking out the ref
2025-11-07T22:19:08.1788525Z [command]/usr/bin/git checkout --progress --force -B main refs/remotes/origin/main
2025-11-07T22:19:08.2160908Z Switched to a new branch 'main'
2025-11-07T22:19:08.2164985Z branch 'main' set up to track 'origin/main'.
2025-11-07T22:19:08.2178295Z ##[endgroup]
2025-11-07T22:19:08.2249334Z [command]/usr/bin/git log -1 --format=%H
2025-11-07T22:19:08.2289171Z e0ff6d7537b297a3aef9cf485f7c4b644953faf0
2025-11-07T22:19:08.2516087Z ##[group]Run actions/setup-node@v4
2025-11-07T22:19:08.2516377Z with:
2025-11-07T22:19:08.2516553Z   node-version: 20
2025-11-07T22:19:08.2516742Z   always-auth: false
2025-11-07T22:19:08.2516928Z   check-latest: false
2025-11-07T22:19:08.2517245Z   token: ***
2025-11-07T22:19:08.2517420Z ##[endgroup]
2025-11-07T22:19:08.4443012Z Found in cache @ /opt/hostedtoolcache/node/20.19.5/x64
2025-11-07T22:19:08.4465684Z ##[group]Environment details
2025-11-07T22:19:08.9418500Z node: v20.19.5
2025-11-07T22:19:08.9420494Z npm: 10.8.2
2025-11-07T22:19:08.9420815Z yarn: 1.22.22
2025-11-07T22:19:08.9422055Z ##[endgroup]
2025-11-07T22:19:08.9531926Z ##[group]Run git fetch --all --tags
2025-11-07T22:19:08.9532305Z [36;1mgit fetch --all --tags[0m
2025-11-07T22:19:08.9573442Z shell: /usr/bin/bash -e {0}
2025-11-07T22:19:08.9573709Z ##[endgroup]
2025-11-07T22:19:09.3080698Z ##[group]Run thebongy/version-check@v2
2025-11-07T22:19:09.3080999Z with:
2025-11-07T22:19:09.3081849Z   file: package.json
2025-11-07T22:19:09.3082131Z   tagFormat: v${version}
2025-11-07T22:19:09.3082322Z   failBuild: true
2025-11-07T22:19:09.3082495Z ##[endgroup]
2025-11-07T22:19:09.3843332Z Reading package.json
2025-11-07T22:19:09.3855780Z Parsing NodeJS package.json
2025-11-07T22:19:09.3858145Z Version in file: 1.3.2
2025-11-07T22:19:09.3858613Z Current Tag: v1.3.2
2025-11-07T22:19:09.3859067Z Obtaining repo tags
2025-11-07T22:19:09.4122374Z Repo has tags: 
2025-11-07T22:19:09.4123865Z v1.3.2 is a new tag, all set to publish new release!
2025-11-07T22:19:09.4235020Z ##[group]Run docker/setup-qemu-action@v3
2025-11-07T22:19:09.4235299Z with:
2025-11-07T22:19:09.4235492Z   image: docker.io/tonistiigi/binfmt:latest
2025-11-07T22:19:09.4235734Z   platforms: all
2025-11-07T22:19:09.4235914Z   cache-image: true
2025-11-07T22:19:09.4236086Z ##[endgroup]
2025-11-07T22:19:09.6988140Z ##[group]Docker info
2025-11-07T22:19:09.7046797Z [command]/usr/bin/docker version
2025-11-07T22:19:09.8123958Z Client: Docker Engine - Community
2025-11-07T22:19:09.8124480Z  Version:           28.0.4
2025-11-07T22:19:09.8124927Z  API version:       1.48
2025-11-07T22:19:09.8125336Z  Go version:        go1.23.7
2025-11-07T22:19:09.8125776Z  Git commit:        b8034c0
2025-11-07T22:19:09.8126269Z  Built:             Tue Mar 25 15:07:16 2025
2025-11-07T22:19:09.8126780Z  OS/Arch:           linux/amd64
2025-11-07T22:19:09.8127164Z  Context:           default
2025-11-07T22:19:09.8127424Z 
2025-11-07T22:19:09.8127683Z Server: Docker Engine - Community
2025-11-07T22:19:09.8128209Z  Engine:
2025-11-07T22:19:09.8128501Z   Version:          28.0.4
2025-11-07T22:19:09.8128974Z   API version:      1.48 (minimum version 1.24)
2025-11-07T22:19:09.8129489Z   Go version:       go1.23.7
2025-11-07T22:19:09.8129902Z   Git commit:       6430e49
2025-11-07T22:19:09.8130372Z   Built:            Tue Mar 25 15:07:16 2025
2025-11-07T22:19:09.8130883Z   OS/Arch:          linux/amd64
2025-11-07T22:19:09.8131497Z   Experimental:     false
2025-11-07T22:19:09.8131856Z  containerd:
2025-11-07T22:19:09.8132254Z   Version:          v1.7.28
2025-11-07T22:19:09.8132788Z   GitCommit:        b98a3aace656320842a23f4a392a33f46af97866
2025-11-07T22:19:09.8133316Z  runc:
2025-11-07T22:19:09.8133605Z   Version:          1.3.0
2025-11-07T22:19:09.8134044Z   GitCommit:        v1.3.0-0-g4ca628d1
2025-11-07T22:19:09.8134458Z  docker-init:
2025-11-07T22:19:09.8134773Z   Version:          0.19.0
2025-11-07T22:19:09.8135140Z   GitCommit:        de40ad0
2025-11-07T22:19:09.8214160Z [command]/usr/bin/docker info
2025-11-07T22:19:12.7954144Z Client: Docker Engine - Community
2025-11-07T22:19:12.7954706Z  Version:    28.0.4
2025-11-07T22:19:12.7955021Z  Context:    default
2025-11-07T22:19:12.7955355Z  Debug Mode: false
2025-11-07T22:19:12.7955674Z  Plugins:
2025-11-07T22:19:12.7956023Z   buildx: Docker Buildx (Docker Inc.)
2025-11-07T22:19:12.7956434Z     Version:  v0.29.1
2025-11-07T22:19:12.7956946Z     Path:     /usr/libexec/docker/cli-plugins/docker-buildx
2025-11-07T22:19:12.7957894Z   compose: Docker Compose (Docker Inc.)
2025-11-07T22:19:12.7958321Z     Version:  v2.38.2
2025-11-07T22:19:12.7958782Z     Path:     /usr/libexec/docker/cli-plugins/docker-compose
2025-11-07T22:19:12.7959147Z 
2025-11-07T22:19:12.7959261Z Server:
2025-11-07T22:19:12.7959533Z  Containers: 0
2025-11-07T22:19:12.7959818Z   Running: 0
2025-11-07T22:19:12.7960104Z   Paused: 0
2025-11-07T22:19:12.7960376Z   Stopped: 0
2025-11-07T22:19:12.7960658Z  Images: 0
2025-11-07T22:19:12.7960952Z  Server Version: 28.0.4
2025-11-07T22:19:12.7961533Z  Storage Driver: overlay2
2025-11-07T22:19:12.7961905Z   Backing Filesystem: extfs
2025-11-07T22:19:12.7962266Z   Supports d_type: true
2025-11-07T22:19:12.7962614Z   Using metacopy: false
2025-11-07T22:19:12.7962948Z   Native Overlay Diff: false
2025-11-07T22:19:12.7963311Z   userxattr: false
2025-11-07T22:19:12.7963649Z  Logging Driver: json-file
2025-11-07T22:19:12.7964034Z  Cgroup Driver: systemd
2025-11-07T22:19:12.7964375Z  Cgroup Version: 2
2025-11-07T22:19:12.7964685Z  Plugins:
2025-11-07T22:19:12.7964962Z   Volume: local
2025-11-07T22:19:12.7965443Z   Network: bridge host ipvlan macvlan null overlay
2025-11-07T22:19:12.7966187Z   Log: awslogs fluentd gcplogs gelf journald json-file local splunk syslog
2025-11-07T22:19:12.7966750Z  Swarm: inactive
2025-11-07T22:19:12.7967141Z  Runtimes: runc io.containerd.runc.v2
2025-11-07T22:19:12.7967593Z  Default Runtime: runc
2025-11-07T22:19:12.7967905Z  Init Binary: docker-init
2025-11-07T22:19:12.7968388Z  containerd version: b98a3aace656320842a23f4a392a33f46af97866
2025-11-07T22:19:12.7969237Z  runc version: v1.3.0-0-g4ca628d1
2025-11-07T22:19:12.7969628Z  init version: de40ad0
2025-11-07T22:19:12.7969943Z  Security Options:
2025-11-07T22:19:12.7970219Z   apparmor
2025-11-07T22:19:12.7970462Z   seccomp
2025-11-07T22:19:12.7970707Z    Profile: builtin
2025-11-07T22:19:12.7971009Z   cgroupns
2025-11-07T22:19:12.7975735Z  Kernel Version: 6.11.0-1018-azure
2025-11-07T22:19:12.7976254Z  Operating System: Ubuntu 24.04.3 LTS
2025-11-07T22:19:12.7976682Z  OSType: linux
2025-11-07T22:19:12.7976993Z  Architecture: x86_64
2025-11-07T22:19:12.7977369Z  CPUs: 2
2025-11-07T22:19:12.7977731Z  Total Memory: 7.758GiB
2025-11-07T22:19:12.7978105Z  Name: runnervmf2e7y
2025-11-07T22:19:12.7978542Z  ID: 53d5b372-3a00-4865-8d81-0d2be474f41b
2025-11-07T22:19:12.7979067Z  Docker Root Dir: /var/lib/docker
2025-11-07T22:19:12.7979498Z  Debug Mode: false
2025-11-07T22:19:12.7979988Z  Username: githubactions
2025-11-07T22:19:12.7980364Z  Experimental: false
2025-11-07T22:19:12.7980738Z  Insecure Registries:
2025-11-07T22:19:12.7981472Z   ::1/128
2025-11-07T22:19:12.7981801Z   127.0.0.0/8
2025-11-07T22:19:12.7982122Z  Live Restore Enabled: false
2025-11-07T22:19:12.7982384Z 
2025-11-07T22:19:12.7990370Z ##[endgroup]
2025-11-07T22:19:12.7993142Z ##[group]Pulling binfmt Docker image
2025-11-07T22:19:13.0929921Z Cache hit for: docker.io--tonistiigi--binfmt-latest-linux-x64
2025-11-07T22:19:14.4347103Z Received 10699411 of 31670931 (33.8%), 10.2 MBs/sec
2025-11-07T22:19:14.6776890Z Received 31670931 of 31670931 (100.0%), 24.3 MBs/sec
2025-11-07T22:19:14.6778889Z Cache Size: ~30 MB (31670931 B)
2025-11-07T22:19:14.6813182Z [command]/usr/bin/tar -xf /home/runner/work/_temp/28cf41f6-0e13-4763-b80d-7ce823f55d99/cache.tzst -P -C /home/runner/work/QuantomOS/QuantomOS --use-compress-program unzstd
2025-11-07T22:19:14.8460786Z Cache restored successfully
2025-11-07T22:19:14.8523497Z Restored docker.io--tonistiigi--binfmt-latest-linux-x64 from GitHub Actions cache
2025-11-07T22:19:14.9311101Z Cached to hosted tool cache /opt/hostedtoolcache/docker.io--tonistiigi--binfmt/latest/linux-x64
2025-11-07T22:19:14.9313347Z Copying /opt/hostedtoolcache/docker.io--tonistiigi--binfmt/latest/linux-x64/image.tar to /home/runner/.docker/.cache/images/docker.io--tonistiigi--binfmt/latest/linux-x64/image.tar
2025-11-07T22:19:15.1798105Z Image found from cache in /home/runner/.docker/.cache/images/docker.io--tonistiigi--binfmt/latest/linux-x64/image.tar
2025-11-07T22:19:15.1823415Z [command]/usr/bin/docker load -i /home/runner/.docker/.cache/images/docker.io--tonistiigi--binfmt/latest/linux-x64/image.tar
2025-11-07T22:19:16.3885825Z Loaded image: tonistiigi/binfmt:latest
2025-11-07T22:19:16.4112679Z [command]/usr/bin/docker pull docker.io/tonistiigi/binfmt:latest
2025-11-07T22:19:17.2372974Z latest: Pulling from tonistiigi/binfmt
2025-11-07T22:19:17.4448467Z Digest: sha256:30cc9a4d03765acac9be2ed0afc23af1ad018aed2c28ea4be8c2eb9afe03fbd1
2025-11-07T22:19:17.4456166Z Status: Image is up to date for tonistiigi/binfmt:latest
2025-11-07T22:19:17.4466386Z docker.io/tonistiigi/binfmt:latest
2025-11-07T22:19:17.4510669Z [command]/usr/bin/docker save -o /home/runner/work/_temp/docker-actions-toolkit-zdcSTe/749e64100d3fa0c09bdbc8a02e4fb9cb3ee64266f7f661c98371040689abacb3.tar docker.io/tonistiigi/binfmt:latest
2025-11-07T22:19:17.9993804Z Copying /home/runner/work/_temp/docker-actions-toolkit-zdcSTe/749e64100d3fa0c09bdbc8a02e4fb9cb3ee64266f7f661c98371040689abacb3.tar to /home/runner/.docker/.cache/images/docker.io--tonistiigi--binfmt/latest/linux-x64/image.tar
2025-11-07T22:19:18.1626918Z Image cached to /home/runner/.docker/.cache/images/docker.io--tonistiigi--binfmt/latest/linux-x64/image.tar
2025-11-07T22:19:18.1628389Z ##[endgroup]
2025-11-07T22:19:18.1629462Z ##[group]Image info
2025-11-07T22:19:18.1649453Z [command]/usr/bin/docker image inspect docker.io/tonistiigi/binfmt:latest
2025-11-07T22:19:18.6715528Z [
2025-11-07T22:19:18.6715984Z     {
2025-11-07T22:19:18.6717088Z         "Id": "sha256:c97f15e717f7eb99d237e46f0a3553da8cfdf470a15bba459c056d90d0e398f5",
2025-11-07T22:19:18.6718018Z         "RepoTags": [
2025-11-07T22:19:18.6718577Z             "tonistiigi/binfmt:latest"
2025-11-07T22:19:18.6719056Z         ],
2025-11-07T22:19:18.6719537Z         "RepoDigests": [
2025-11-07T22:19:18.6720470Z             "tonistiigi/binfmt@sha256:30cc9a4d03765acac9be2ed0afc23af1ad018aed2c28ea4be8c2eb9afe03fbd1"
2025-11-07T22:19:18.6721560Z         ],
2025-11-07T22:19:18.6756633Z         "Parent": "",
2025-11-07T22:19:18.6757080Z         "Comment": "buildkit.dockerfile.v0",
2025-11-07T22:19:18.6757591Z         "Created": "2025-09-11T09:43:57.050886711Z",
2025-11-07T22:19:18.6758020Z         "DockerVersion": "",
2025-11-07T22:19:18.6758378Z         "Author": "",
2025-11-07T22:19:18.6758704Z         "Config": {
2025-11-07T22:19:18.6758998Z             "Hostname": "",
2025-11-07T22:19:18.6759337Z             "Domainname": "",
2025-11-07T22:19:18.6759684Z             "User": "",
2025-11-07T22:19:18.6760048Z             "AttachStdin": false,
2025-11-07T22:19:18.6760533Z             "AttachStdout": false,
2025-11-07T22:19:18.6760993Z             "AttachStderr": false,
2025-11-07T22:19:18.6761680Z             "Tty": false,
2025-11-07T22:19:18.6762358Z             "OpenStdin": false,
2025-11-07T22:19:18.6762843Z             "StdinOnce": false,
2025-11-07T22:19:18.6763930Z             "Env": [
2025-11-07T22:19:18.6764836Z                 "PATH=/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin",
2025-11-07T22:19:18.6765506Z                 "QEMU_PRESERVE_ARGV0=1"
2025-11-07T22:19:18.6765902Z             ],
2025-11-07T22:19:18.6766216Z             "Cmd": null,
2025-11-07T22:19:18.6766570Z             "Image": "",
2025-11-07T22:19:18.6766921Z             "Volumes": {
2025-11-07T22:19:18.6767262Z                 "/tmp": {}
2025-11-07T22:19:18.6767619Z             },
2025-11-07T22:19:18.6767967Z             "WorkingDir": "/",
2025-11-07T22:19:18.6768329Z             "Entrypoint": [
2025-11-07T22:19:18.6768704Z                 "/usr/bin/binfmt"
2025-11-07T22:19:18.6769061Z             ],
2025-11-07T22:19:18.6769334Z             "OnBuild": null,
2025-11-07T22:19:18.6769648Z             "Labels": {
2025-11-07T22:19:18.6770177Z                 "org.opencontainers.image.created": "2025-09-11T09:13:47.128Z",
2025-11-07T22:19:18.6771408Z                 "org.opencontainers.image.description": "Cross-platform emulator collection distributed with Docker images",
2025-11-07T22:19:18.6772641Z                 "org.opencontainers.image.licenses": "MIT",
2025-11-07T22:19:18.6773401Z                 "org.opencontainers.image.revision": "8bf932dba1f67bb274320e7cebece2807e4b99e1",
2025-11-07T22:19:18.6774304Z                 "org.opencontainers.image.source": "https://github.com/tonistiigi/binfmt",
2025-11-07T22:19:18.6775040Z                 "org.opencontainers.image.title": "Binfmt",
2025-11-07T22:19:18.6775800Z                 "org.opencontainers.image.url": "https://github.com/tonistiigi/binfmt",
2025-11-07T22:19:18.6776602Z                 "org.opencontainers.image.version": "qemu-v10.0.4-56"
2025-11-07T22:19:18.6777103Z             }
2025-11-07T22:19:18.6777378Z         },
2025-11-07T22:19:18.6777696Z         "Architecture": "amd64",
2025-11-07T22:19:18.6778067Z         "Os": "linux",
2025-11-07T22:19:18.6778389Z         "Size": 83325873,
2025-11-07T22:19:18.6778736Z         "GraphDriver": {
2025-11-07T22:19:18.6779049Z             "Data": {
2025-11-07T22:19:18.6779868Z                 "LowerDir": "/var/lib/docker/overlay2/8538085a73058f205f4965476b045637f6419114508eb96e8373caa9c4720864/diff",
2025-11-07T22:19:18.6781554Z                 "MergedDir": "/var/lib/docker/overlay2/7496b52eb25a0c61ab8342226feab5e533decba58f0f996e7f11a850ee7b2420/merged",
2025-11-07T22:19:18.6783038Z                 "UpperDir": "/var/lib/docker/overlay2/7496b52eb25a0c61ab8342226feab5e533decba58f0f996e7f11a850ee7b2420/diff",
2025-11-07T22:19:18.6784551Z                 "WorkDir": "/var/lib/docker/overlay2/7496b52eb25a0c61ab8342226feab5e533decba58f0f996e7f11a850ee7b2420/work"
2025-11-07T22:19:18.6785653Z             },
2025-11-07T22:19:18.6786020Z             "Name": "overlay2"
2025-11-07T22:19:18.6786382Z         },
2025-11-07T22:19:18.6786674Z         "RootFS": {
2025-11-07T22:19:18.6787015Z             "Type": "layers",
2025-11-07T22:19:18.6787398Z             "Layers": [
2025-11-07T22:19:18.6788082Z                 "sha256:ba63059928005ec5a66585f9353d2f4e14eaede3da6a25acac0a4f44d809cb64",
2025-11-07T22:19:18.6789212Z                 "sha256:66aa431c2e5b0cb36e6f7fde44ab8195fab52d6c93b407c720212e28337ac745"
2025-11-07T22:19:18.6789918Z             ]
2025-11-07T22:19:18.6790219Z         },
2025-11-07T22:19:18.6790519Z         "Metadata": {
2025-11-07T22:19:18.6790936Z             "LastTagTime": "0001-01-01T00:00:00Z"
2025-11-07T22:19:18.6791621Z         }
2025-11-07T22:19:18.6791880Z     }
2025-11-07T22:19:18.6792175Z ]
2025-11-07T22:19:18.6792802Z ##[endgroup]
2025-11-07T22:19:18.6793412Z ##[group]Binfmt version
2025-11-07T22:19:18.6794469Z [command]/usr/bin/docker run --rm --privileged docker.io/tonistiigi/binfmt:latest --version
2025-11-07T22:19:19.7994306Z binfmt/8bf932d qemu/v10.0.4 go/1.23.12
2025-11-07T22:19:19.8823001Z ##[endgroup]
2025-11-07T22:19:19.8823625Z ##[group]Installing QEMU static binaries
2025-11-07T22:19:19.8843015Z [command]/usr/bin/docker run --rm --privileged docker.io/tonistiigi/binfmt:latest --install all
2025-11-07T22:19:20.0557981Z installing: riscv64 OK
2025-11-07T22:19:20.0559972Z installing: mips64le OK
2025-11-07T22:19:20.0560374Z installing: arm64 OK
2025-11-07T22:19:20.0560718Z installing: arm OK
2025-11-07T22:19:20.0561063Z installing: s390x OK
2025-11-07T22:19:20.0562244Z installing: ppc64le OK
2025-11-07T22:19:20.0562647Z installing: mips64 OK
2025-11-07T22:19:20.0563031Z installing: loong64 OK
2025-11-07T22:19:20.0811112Z {
2025-11-07T22:19:20.0814834Z   "supported": [
2025-11-07T22:19:20.0815371Z     "linux/amd64",
2025-11-07T22:19:20.0815693Z     "linux/amd64/v2",
2025-11-07T22:19:20.0816017Z     "linux/amd64/v3",
2025-11-07T22:19:20.0816338Z     "linux/arm64",
2025-11-07T22:19:20.0816677Z     "linux/riscv64",
2025-11-07T22:19:20.0817010Z     "linux/ppc64le",
2025-11-07T22:19:20.0817330Z     "linux/s390x",
2025-11-07T22:19:20.0823012Z     "linux/386",
2025-11-07T22:19:20.0823350Z     "linux/mips64le",
2025-11-07T22:19:20.0823673Z     "linux/mips64",
2025-11-07T22:19:20.0823993Z     "linux/loong64",
2025-11-07T22:19:20.0824327Z     "linux/arm/v7",
2025-11-07T22:19:20.0825018Z     "linux/arm/v6"
2025-11-07T22:19:20.0825342Z   ],
2025-11-07T22:19:20.0825624Z   "emulators": [
2025-11-07T22:19:20.0825990Z     "llvm-16-runtime.binfmt",
2025-11-07T22:19:20.0826402Z     "llvm-17-runtime.binfmt",
2025-11-07T22:19:20.0826762Z     "llvm-18-runtime.binfmt",
2025-11-07T22:19:20.0827092Z     "python3.12",
2025-11-07T22:19:20.0827386Z     "qemu-aarch64",
2025-11-07T22:19:20.0827670Z     "qemu-arm",
2025-11-07T22:19:20.0827955Z     "qemu-loongarch64",
2025-11-07T22:19:20.0828256Z     "qemu-mips64",
2025-11-07T22:19:20.0828558Z     "qemu-mips64el",
2025-11-07T22:19:20.0828882Z     "qemu-ppc64le",
2025-11-07T22:19:20.0829194Z     "qemu-riscv64",
2025-11-07T22:19:20.0829498Z     "qemu-s390x"
2025-11-07T22:19:20.0829771Z   ]
2025-11-07T22:19:20.0830042Z }
2025-11-07T22:19:20.1664025Z ##[endgroup]
2025-11-07T22:19:20.1665226Z ##[group]Extracting available platforms
2025-11-07T22:19:20.4407402Z linux/amd64,linux/amd64/v2,linux/amd64/v3,linux/arm64,linux/riscv64,linux/ppc64le,linux/s390x,linux/386,linux/mips64le,linux/mips64,linux/loong64,linux/arm/v7,linux/arm/v6
2025-11-07T22:19:20.4419078Z ##[endgroup]
2025-11-07T22:19:20.4570594Z ##[group]Run docker/setup-buildx-action@v3
2025-11-07T22:19:20.4570888Z with:
2025-11-07T22:19:20.4571111Z   platforms: linux/amd64,linux/arm64,linux/arm/v7
2025-11-07T22:19:20.4571789Z   driver: docker-container
2025-11-07T22:19:20.4572004Z   install: false
2025-11-07T22:19:20.4572184Z   use: true
2025-11-07T22:19:20.4572358Z   keep-state: false
2025-11-07T22:19:20.4572542Z   cache-binary: true
2025-11-07T22:19:20.4572737Z   cleanup: true
2025-11-07T22:19:20.4572917Z ##[endgroup]
2025-11-07T22:19:20.7798022Z ##[group]Docker info
2025-11-07T22:19:20.7817062Z [command]/usr/bin/docker version
2025-11-07T22:19:20.8023904Z Client: Docker Engine - Community
2025-11-07T22:19:20.8026092Z  Version:           28.0.4
2025-11-07T22:19:20.8032553Z  API version:       1.48
2025-11-07T22:19:20.8032967Z  Go version:        go1.23.7
2025-11-07T22:19:20.8033348Z  Git commit:        b8034c0
2025-11-07T22:19:20.8033817Z  Built:             Tue Mar 25 15:07:16 2025
2025-11-07T22:19:20.8034351Z  OS/Arch:           linux/amd64
2025-11-07T22:19:20.8034733Z  Context:           default
2025-11-07T22:19:20.8034959Z 
2025-11-07T22:19:20.8035182Z Server: Docker Engine - Community
2025-11-07T22:19:20.8035583Z  Engine:
2025-11-07T22:19:20.8035873Z   Version:          28.0.4
2025-11-07T22:19:20.8036317Z   API version:      1.48 (minimum version 1.24)
2025-11-07T22:19:20.8036776Z   Go version:       go1.23.7
2025-11-07T22:19:20.8037142Z   Git commit:       6430e49
2025-11-07T22:19:20.8037577Z   Built:            Tue Mar 25 15:07:16 2025
2025-11-07T22:19:20.8038023Z   OS/Arch:          linux/amd64
2025-11-07T22:19:20.8038402Z   Experimental:     false
2025-11-07T22:19:20.8038766Z  containerd:
2025-11-07T22:19:20.8039076Z   Version:          v1.7.28
2025-11-07T22:19:20.8039609Z   GitCommit:        b98a3aace656320842a23f4a392a33f46af97866
2025-11-07T22:19:20.8040100Z  runc:
2025-11-07T22:19:20.8040390Z   Version:          1.3.0
2025-11-07T22:19:20.8040804Z   GitCommit:        v1.3.0-0-g4ca628d1
2025-11-07T22:19:20.8042951Z  docker-init:
2025-11-07T22:19:20.8043492Z   Version:          0.19.0
2025-11-07T22:19:20.8043903Z   GitCommit:        de40ad0
2025-11-07T22:19:20.8088964Z [command]/usr/bin/docker info
2025-11-07T22:19:20.8872615Z Client: Docker Engine - Community
2025-11-07T22:19:20.8873126Z  Version:    28.0.4
2025-11-07T22:19:20.8883149Z  Context:    default
2025-11-07T22:19:20.8885384Z  Debug Mode: false
2025-11-07T22:19:20.8885734Z  Plugins:
2025-11-07T22:19:20.8887333Z   buildx: Docker Buildx (Docker Inc.)
2025-11-07T22:19:20.8888898Z     Version:  v0.29.1
2025-11-07T22:19:20.8892418Z     Path:     /usr/libexec/docker/cli-plugins/docker-buildx
2025-11-07T22:19:20.8893068Z   compose: Docker Compose (Docker Inc.)
2025-11-07T22:19:20.8893554Z     Version:  v2.38.2
2025-11-07T22:19:20.8894105Z     Path:     /usr/libexec/docker/cli-plugins/docker-compose
2025-11-07T22:19:20.8894525Z 
2025-11-07T22:19:20.8894652Z Server:
2025-11-07T22:19:20.8895408Z  Containers: 0
2025-11-07T22:19:20.8895719Z   Running: 0
2025-11-07T22:19:20.8896026Z   Paused: 0
2025-11-07T22:19:20.8896299Z   Stopped: 0
2025-11-07T22:19:20.8896562Z  Images: 1
2025-11-07T22:19:20.8896839Z  Server Version: 28.0.4
2025-11-07T22:19:20.8897197Z  Storage Driver: overlay2
2025-11-07T22:19:20.8897589Z   Backing Filesystem: extfs
2025-11-07T22:19:20.8897956Z   Supports d_type: true
2025-11-07T22:19:20.8898329Z   Using metacopy: false
2025-11-07T22:19:20.8898690Z   Native Overlay Diff: false
2025-11-07T22:19:20.8899074Z   userxattr: false
2025-11-07T22:19:20.8899429Z  Logging Driver: json-file
2025-11-07T22:19:20.8899789Z  Cgroup Driver: systemd
2025-11-07T22:19:20.8900114Z  Cgroup Version: 2
2025-11-07T22:19:20.8900432Z  Plugins:
2025-11-07T22:19:20.8900728Z   Volume: local
2025-11-07T22:19:20.8905267Z   Network: bridge host ipvlan macvlan null overlay
2025-11-07T22:19:20.8906156Z   Log: awslogs fluentd gcplogs gelf journald json-file local splunk syslog
2025-11-07T22:19:20.8906826Z  Swarm: inactive
2025-11-07T22:19:20.8907259Z  Runtimes: io.containerd.runc.v2 runc
2025-11-07T22:19:20.8908071Z  Default Runtime: runc
2025-11-07T22:19:20.8908528Z  Init Binary: docker-init
2025-11-07T22:19:20.8909132Z  containerd version: b98a3aace656320842a23f4a392a33f46af97866
2025-11-07T22:19:20.8909783Z  runc version: v1.3.0-0-g4ca628d1
2025-11-07T22:19:20.8910235Z  init version: de40ad0
2025-11-07T22:19:20.8910620Z  Security Options:
2025-11-07T22:19:20.8910962Z   apparmor
2025-11-07T22:19:20.8911552Z   seccomp
2025-11-07T22:19:20.8911889Z    Profile: builtin
2025-11-07T22:19:20.8912291Z   cgroupns
2025-11-07T22:19:20.8912668Z  Kernel Version: 6.11.0-1018-azure
2025-11-07T22:19:20.8913176Z  Operating System: Ubuntu 24.04.3 LTS
2025-11-07T22:19:20.8913627Z  OSType: linux
2025-11-07T22:19:20.8913981Z  Architecture: x86_64
2025-11-07T22:19:20.8914327Z  CPUs: 2
2025-11-07T22:19:20.8914634Z  Total Memory: 7.758GiB
2025-11-07T22:19:20.8915014Z  Name: runnervmf2e7y
2025-11-07T22:19:20.8915465Z  ID: 53d5b372-3a00-4865-8d81-0d2be474f41b
2025-11-07T22:19:20.8916005Z  Docker Root Dir: /var/lib/docker
2025-11-07T22:19:20.8916444Z  Debug Mode: false
2025-11-07T22:19:20.8916813Z  Username: githubactions
2025-11-07T22:19:20.8917204Z  Experimental: false
2025-11-07T22:19:20.8917567Z  Insecure Registries:
2025-11-07T22:19:20.8917955Z   ::1/128
2025-11-07T22:19:20.8918260Z   127.0.0.0/8
2025-11-07T22:19:20.8918604Z  Live Restore Enabled: false
2025-11-07T22:19:20.8925999Z 
2025-11-07T22:19:20.8926539Z ##[endgroup]
2025-11-07T22:19:20.9908267Z ##[group]Buildx version
2025-11-07T22:19:20.9954057Z [command]/usr/bin/docker buildx version
2025-11-07T22:19:21.0906775Z github.com/docker/buildx v0.29.1 a32761aeb3debd39be1eca514af3693af0db334b
2025-11-07T22:19:21.0932983Z ##[endgroup]
2025-11-07T22:19:21.1111089Z ##[group]Inspecting default docker context
2025-11-07T22:19:21.1258852Z [
2025-11-07T22:19:21.1259593Z   {
2025-11-07T22:19:21.1260359Z     "Name": "default",
2025-11-07T22:19:21.1260981Z     "Metadata": {},
2025-11-07T22:19:21.1261570Z     "Endpoints": {
2025-11-07T22:19:21.1261885Z       "docker": {
2025-11-07T22:19:21.1262319Z         "Host": "unix:///var/run/docker.sock",
2025-11-07T22:19:21.1262819Z         "SkipTLSVerify": false
2025-11-07T22:19:21.1263180Z       }
2025-11-07T22:19:21.1263435Z     },
2025-11-07T22:19:21.1263719Z     "TLSMaterial": {},
2025-11-07T22:19:21.1264044Z     "Storage": {
2025-11-07T22:19:21.1264410Z       "MetadataPath": "<IN MEMORY>",
2025-11-07T22:19:21.1264851Z       "TLSPath": "<IN MEMORY>"
2025-11-07T22:19:21.1265210Z     }
2025-11-07T22:19:21.1265470Z   }
2025-11-07T22:19:21.1265734Z ]
2025-11-07T22:19:21.1266364Z ##[endgroup]
2025-11-07T22:19:21.1266945Z ##[group]Creating a new builder instance
2025-11-07T22:19:21.2683231Z [command]/usr/bin/docker buildx create --name builder-61b66163-73e3-4c5e-a8ec-52fa5a655a6c --driver docker-container --buildkitd-flags --allow-insecure-entitlement security.insecure --allow-insecure-entitlement network.host --platform linux/amd64,linux/arm64,linux/arm/v7 --use
2025-11-07T22:19:21.3472119Z builder-61b66163-73e3-4c5e-a8ec-52fa5a655a6c
2025-11-07T22:19:21.3497278Z ##[endgroup]
2025-11-07T22:19:21.3499814Z ##[group]Booting builder
2025-11-07T22:19:21.3538981Z [command]/usr/bin/docker buildx inspect --bootstrap --builder builder-61b66163-73e3-4c5e-a8ec-52fa5a655a6c
2025-11-07T22:19:21.4052026Z #1 [internal] booting buildkit
2025-11-07T22:19:21.5560768Z #1 pulling image moby/buildkit:buildx-stable-1
2025-11-07T22:19:26.0915266Z #1 pulling image moby/buildkit:buildx-stable-1 4.7s done
2025-11-07T22:19:26.2443837Z #1 creating container buildx_buildkit_builder-61b66163-73e3-4c5e-a8ec-52fa5a655a6c0
2025-11-07T22:19:26.4746684Z #1 creating container buildx_buildkit_builder-61b66163-73e3-4c5e-a8ec-52fa5a655a6c0 0.4s done
2025-11-07T22:19:26.4905034Z #1 DONE 5.1s
2025-11-07T22:19:26.5276558Z Name:          builder-61b66163-73e3-4c5e-a8ec-52fa5a655a6c
2025-11-07T22:19:26.5281633Z Driver:        docker-container
2025-11-07T22:19:26.5283340Z Last Activity: 2025-11-07 22:19:21 +0000 UTC
2025-11-07T22:19:26.5283738Z 
2025-11-07T22:19:26.5283891Z Nodes:
2025-11-07T22:19:26.5284833Z Name:                  builder-61b66163-73e3-4c5e-a8ec-52fa5a655a6c0
2025-11-07T22:19:26.5285639Z Endpoint:              unix:///var/run/docker.sock
2025-11-07T22:19:26.5286183Z Status:                running
2025-11-07T22:19:26.5287252Z BuildKit daemon flags: --allow-insecure-entitlement security.insecure --allow-insecure-entitlement network.host
2025-11-07T22:19:26.5289244Z BuildKit version:      v0.25.1
2025-11-07T22:19:26.5290914Z Platforms:             linux/amd64*, linux/arm64*, linux/arm/v7*, linux/amd64/v2, linux/amd64/v3, linux/riscv64, linux/ppc64le, linux/s390x, linux/386, linux/mips64le, linux/mips64, linux/loong64, linux/arm/v6
2025-11-07T22:19:26.5292443Z Labels:
2025-11-07T22:19:26.5292910Z  org.mobyproject.buildkit.worker.executor:         oci
2025-11-07T22:19:26.5293662Z  org.mobyproject.buildkit.worker.hostname:         26dbeb56f074
2025-11-07T22:19:26.5294398Z  org.mobyproject.buildkit.worker.network:          host
2025-11-07T22:19:26.5295135Z  org.mobyproject.buildkit.worker.oci.process-mode: sandbox
2025-11-07T22:19:26.5295885Z  org.mobyproject.buildkit.worker.selinux.enabled:  false
2025-11-07T22:19:26.5296622Z  org.mobyproject.buildkit.worker.snapshotter:      overlayfs
2025-11-07T22:19:26.5297194Z GC Policy rule#0:
2025-11-07T22:19:26.5297503Z  All:            false
2025-11-07T22:19:26.5298134Z  Filters:        type==source.local,type==exec.cachemount,type==source.git.checkout
2025-11-07T22:19:26.5298766Z  Keep Duration:  48h0m0s
2025-11-07T22:19:26.5299121Z  Max Used Space: 488.3MiB
2025-11-07T22:19:26.5299502Z GC Policy rule#1:
2025-11-07T22:19:26.5299804Z  All:            false
2025-11-07T22:19:26.5300134Z  Keep Duration:  1440h0m0s
2025-11-07T22:19:26.5300493Z  Reserved Space: 7.451GiB
2025-11-07T22:19:26.5300847Z  Max Used Space: 54.02GiB
2025-11-07T22:19:26.5301328Z  Min Free Space: 13.97GiB
2025-11-07T22:19:26.5301690Z GC Policy rule#2:
2025-11-07T22:19:26.5302004Z  All:            false
2025-11-07T22:19:26.5302328Z  Reserved Space: 7.451GiB
2025-11-07T22:19:26.5302688Z  Max Used Space: 54.02GiB
2025-11-07T22:19:26.5303052Z  Min Free Space: 13.97GiB
2025-11-07T22:19:26.5303415Z GC Policy rule#3:
2025-11-07T22:19:26.5303711Z  All:            true
2025-11-07T22:19:26.5304011Z  Reserved Space: 7.451GiB
2025-11-07T22:19:26.5304350Z  Max Used Space: 54.02GiB
2025-11-07T22:19:26.5304673Z  Min Free Space: 13.97GiB
2025-11-07T22:19:26.5349028Z ##[endgroup]
2025-11-07T22:19:26.6357525Z ##[group]Inspect builder
2025-11-07T22:19:26.6362163Z {
2025-11-07T22:19:26.6362760Z   "nodes": [
2025-11-07T22:19:26.6364517Z     {
2025-11-07T22:19:26.6366814Z       "name": "builder-61b66163-73e3-4c5e-a8ec-52fa5a655a6c0",
2025-11-07T22:19:26.6367577Z       "endpoint": "unix:///var/run/docker.sock",
2025-11-07T22:19:26.6368097Z       "status": "running",
2025-11-07T22:19:26.6372725Z       "buildkitd-flags": "--allow-insecure-entitlement security.insecure --allow-insecure-entitlement network.host",
2025-11-07T22:19:26.6373981Z       "buildkit": "v0.25.1",
2025-11-07T22:19:26.6374527Z       "platforms": "linux/amd64,linux/arm64,linux/arm/v7",
2025-11-07T22:19:26.6375013Z       "features": {
2025-11-07T22:19:26.6375587Z         "Automatically load images to the Docker Engine image store": true,
2025-11-07T22:19:26.6376131Z         "Cache export": true,
2025-11-07T22:19:26.6376489Z         "Direct push": true,
2025-11-07T22:19:26.6376894Z         "Docker exporter": true,
2025-11-07T22:19:26.6377321Z         "Multi-platform build": true,
2025-11-07T22:19:26.6377737Z         "OCI exporter": true
2025-11-07T22:19:26.6378082Z       },
2025-11-07T22:19:26.6378357Z       "labels": {
2025-11-07T22:19:26.6378810Z         "org.mobyproject.buildkit.worker.executor": "oci",
2025-11-07T22:19:26.6379506Z         "org.mobyproject.buildkit.worker.hostname": "26dbeb56f074",
2025-11-07T22:19:26.6380185Z         "org.mobyproject.buildkit.worker.network": "host",
2025-11-07T22:19:26.6380918Z         "org.mobyproject.buildkit.worker.oci.process-mode": "sandbox",
2025-11-07T22:19:26.6382180Z         "org.mobyproject.buildkit.worker.selinux.enabled": "false",
2025-11-07T22:19:26.6382940Z         "org.mobyproject.buildkit.worker.snapshotter": "overlayfs"
2025-11-07T22:19:26.6383482Z       },
2025-11-07T22:19:26.6383747Z       "gcPolicy": [
2025-11-07T22:19:26.6384038Z         {
2025-11-07T22:19:26.6384305Z           "all": false,
2025-11-07T22:19:26.6384623Z           "filter": [
2025-11-07T22:19:26.6384985Z             "type==source.local",
2025-11-07T22:19:26.6385419Z             "type==exec.cachemount",
2025-11-07T22:19:26.6385861Z             "type==source.git.checkout"
2025-11-07T22:19:26.6386259Z           ],
2025-11-07T22:19:26.6386598Z           "keepDuration": "48h0m0s",
2025-11-07T22:19:26.6387035Z           "maxUsedSpace": "488.3MiB"
2025-11-07T22:19:26.6387397Z         },
2025-11-07T22:19:26.6387662Z         {
2025-11-07T22:19:26.6387938Z           "all": false,
2025-11-07T22:19:26.6388318Z           "keepDuration": "1440h0m0s",
2025-11-07T22:19:26.6388774Z           "reservedSpace": "7.451GiB",
2025-11-07T22:19:26.6389226Z           "maxUsedSpace": "54.02GiB",
2025-11-07T22:19:26.6389665Z           "minFreeSpace": "13.97GiB"
2025-11-07T22:19:26.6390028Z         },
2025-11-07T22:19:26.6390293Z         {
2025-11-07T22:19:26.6390559Z           "all": false,
2025-11-07T22:19:26.6390931Z           "reservedSpace": "7.451GiB",
2025-11-07T22:19:26.6391541Z           "maxUsedSpace": "54.02GiB",
2025-11-07T22:19:26.6391980Z           "minFreeSpace": "13.97GiB"
2025-11-07T22:19:26.6392345Z         },
2025-11-07T22:19:26.6392602Z         {
2025-11-07T22:19:26.6392869Z           "all": true,
2025-11-07T22:19:26.6393246Z           "reservedSpace": "7.451GiB",
2025-11-07T22:19:26.6393678Z           "maxUsedSpace": "54.02GiB",
2025-11-07T22:19:26.6394113Z           "minFreeSpace": "13.97GiB"
2025-11-07T22:19:26.6394483Z         }
2025-11-07T22:19:26.6394735Z       ]
2025-11-07T22:19:26.6394978Z     }
2025-11-07T22:19:26.6395234Z   ],
2025-11-07T22:19:26.6395653Z   "name": "builder-61b66163-73e3-4c5e-a8ec-52fa5a655a6c",
2025-11-07T22:19:26.6396195Z   "driver": "docker-container",
2025-11-07T22:19:26.6396637Z   "lastActivity": "2025-11-07T22:19:21.000Z"
2025-11-07T22:19:26.6397034Z }
2025-11-07T22:19:26.6397564Z ##[endgroup]
2025-11-07T22:19:26.6398050Z ##[group]BuildKit version
2025-11-07T22:19:26.6398601Z builder-61b66163-73e3-4c5e-a8ec-52fa5a655a6c0: v0.25.1
2025-11-07T22:19:26.6399268Z ##[endgroup]
2025-11-07T22:19:26.6520732Z ##[group]Run docker/login-action@v3
2025-11-07T22:19:26.6521018Z with:
2025-11-07T22:19:26.6521447Z   registry: ghcr.io
2025-11-07T22:19:26.6521660Z   username: Snenjih
2025-11-07T22:19:26.6522249Z   password: ***
2025-11-07T22:19:26.6522445Z   logout: true
2025-11-07T22:19:26.6522627Z ##[endgroup]
2025-11-07T22:19:26.9679020Z Logging into ghcr.io...
2025-11-07T22:19:27.5782676Z Login Succeeded!
2025-11-07T22:19:27.5923995Z ##[group]Run npm install
2025-11-07T22:19:27.5924416Z [36;1mnpm install[0m
2025-11-07T22:19:27.5970241Z shell: /usr/bin/bash -e {0}
2025-11-07T22:19:27.5970647Z ##[endgroup]
2025-11-07T22:19:34.6436921Z npm warn deprecated npmlog@5.0.1: This package is no longer supported.
2025-11-07T22:19:35.3177819Z npm warn deprecated inflight@1.0.6: This module is not supported, and leaks memory. Do not use it. Check out lru-cache if you want a good and tested way to coalesce async requests by a key value, which is much more comprehensive and powerful.
2025-11-07T22:19:35.8042177Z npm warn deprecated text-encoding@0.6.4: no longer maintained
2025-11-07T22:19:35.8255349Z npm warn deprecated gauge@3.0.2: This package is no longer supported.
2025-11-07T22:19:36.4686372Z npm warn deprecated are-we-there-yet@2.0.0: This package is no longer supported.
2025-11-07T22:19:38.0377958Z npm warn deprecated glob@7.2.3: Glob versions prior to v9 are no longer supported
2025-11-07T22:19:38.0455161Z npm warn deprecated rimraf@3.0.2: Rimraf versions prior to v4 are no longer supported
2025-11-07T22:19:50.4821419Z 
2025-11-07T22:19:50.4823255Z added 780 packages, and audited 781 packages in 23s
2025-11-07T22:19:50.4824609Z 
2025-11-07T22:19:50.4842401Z 246 packages are looking for funding
2025-11-07T22:19:50.4842935Z   run `npm fund` for details
2025-11-07T22:19:50.4844030Z 
2025-11-07T22:19:50.4844242Z found 0 vulnerabilities
2025-11-07T22:19:50.5250189Z ##[group]Run echo "REPO_LOWER=$(echo QuantomDevs/QuantomOS | tr '[:upper:]' '[:lower:]')" >> $GITHUB_ENV
2025-11-07T22:19:50.5250889Z [36;1mecho "REPO_LOWER=$(echo QuantomDevs/QuantomOS | tr '[:upper:]' '[:lower:]')" >> $GITHUB_ENV[0m
2025-11-07T22:19:50.5283811Z shell: /usr/bin/bash -e {0}
2025-11-07T22:19:50.5284069Z ##[endgroup]
2025-11-07T22:19:50.5426639Z ##[group]Run docker/build-push-action@v5
2025-11-07T22:19:50.5426919Z with:
2025-11-07T22:19:50.5427089Z   context: .
2025-11-07T22:19:50.5427259Z   push: true
2025-11-07T22:19:50.5427465Z   platforms: linux/amd64,linux/arm64,linux/arm/v7
2025-11-07T22:19:50.5427888Z   tags: ghcr.io/quantomdevs/quantomos:latest
ghcr.io/quantomdevs/quantomos:v1.3.2

2025-11-07T22:19:50.5428289Z   load: false
2025-11-07T22:19:50.5428461Z   no-cache: false
2025-11-07T22:19:50.5428639Z   pull: false
2025-11-07T22:19:50.5428964Z   github-token: ***
2025-11-07T22:19:50.5429153Z env:
2025-11-07T22:19:50.5429326Z   REPO_LOWER: quantomdevs/quantomos
2025-11-07T22:19:50.5429564Z ##[endgroup]
2025-11-07T22:19:50.8084619Z ##[group]GitHub Actions runtime token ACs
2025-11-07T22:19:50.8123387Z refs/heads/main: read/write
2025-11-07T22:19:50.8125432Z ##[endgroup]
2025-11-07T22:19:50.8127511Z ##[group]Docker info
2025-11-07T22:19:50.8172736Z [command]/usr/bin/docker version
2025-11-07T22:19:50.8494349Z Client: Docker Engine - Community
2025-11-07T22:19:50.8498109Z  Version:           28.0.4
2025-11-07T22:19:50.8498897Z  API version:       1.48
2025-11-07T22:19:50.8502961Z  Go version:        go1.23.7
2025-11-07T22:19:50.8510058Z  Git commit:        b8034c0
2025-11-07T22:19:50.8510551Z  Built:             Tue Mar 25 15:07:16 2025
2025-11-07T22:19:50.8511050Z  OS/Arch:           linux/amd64
2025-11-07T22:19:50.8513253Z  Context:           default
2025-11-07T22:19:50.8513496Z 
2025-11-07T22:19:50.8513725Z Server: Docker Engine - Community
2025-11-07T22:19:50.8514099Z  Engine:
2025-11-07T22:19:50.8514388Z   Version:          28.0.4
2025-11-07T22:19:50.8514831Z   API version:      1.48 (minimum version 1.24)
2025-11-07T22:19:50.8515288Z   Go version:       go1.23.7
2025-11-07T22:19:50.8515665Z   Git commit:       6430e49
2025-11-07T22:19:50.8516082Z   Built:            Tue Mar 25 15:07:16 2025
2025-11-07T22:19:50.8516543Z   OS/Arch:          linux/amd64
2025-11-07T22:19:50.8516927Z   Experimental:     false
2025-11-07T22:19:50.8517283Z  containerd:
2025-11-07T22:19:50.8517578Z   Version:          v1.7.28
2025-11-07T22:19:50.8518105Z   GitCommit:        b98a3aace656320842a23f4a392a33f46af97866
2025-11-07T22:19:50.8518628Z  runc:
2025-11-07T22:19:50.8518934Z   Version:          1.3.0
2025-11-07T22:19:50.8519385Z   GitCommit:        v1.3.0-0-g4ca628d1
2025-11-07T22:19:50.8520277Z  docker-init:
2025-11-07T22:19:50.8520621Z   Version:          0.19.0
2025-11-07T22:19:50.8521030Z   GitCommit:        de40ad0
2025-11-07T22:19:50.8566899Z [command]/usr/bin/docker info
2025-11-07T22:19:50.9281873Z Client: Docker Engine - Community
2025-11-07T22:19:50.9282427Z  Version:    28.0.4
2025-11-07T22:19:50.9284140Z  Context:    default
2025-11-07T22:19:50.9284514Z  Debug Mode: false
2025-11-07T22:19:50.9284841Z  Plugins:
2025-11-07T22:19:50.9285220Z   buildx: Docker Buildx (Docker Inc.)
2025-11-07T22:19:50.9285804Z     Version:  v0.29.1
2025-11-07T22:19:50.9286685Z     Path:     /usr/libexec/docker/cli-plugins/docker-buildx
2025-11-07T22:19:50.9290891Z   compose: Docker Compose (Docker Inc.)
2025-11-07T22:19:50.9291836Z     Version:  v2.38.2
2025-11-07T22:19:50.9295103Z     Path:     /usr/libexec/docker/cli-plugins/docker-compose
2025-11-07T22:19:50.9298982Z 
2025-11-07T22:19:50.9299362Z Server:
2025-11-07T22:19:50.9299800Z  Containers: 1
2025-11-07T22:19:50.9300228Z   Running: 1
2025-11-07T22:19:50.9310700Z   Paused: 0
2025-11-07T22:19:50.9311746Z   Stopped: 0
2025-11-07T22:19:50.9312083Z  Images: 2
2025-11-07T22:19:50.9312418Z  Server Version: 28.0.4
2025-11-07T22:19:50.9315172Z  Storage Driver: overlay2
2025-11-07T22:19:50.9316456Z   Backing Filesystem: extfs
2025-11-07T22:19:50.9316853Z   Supports d_type: true
2025-11-07T22:19:50.9317193Z   Using metacopy: false
2025-11-07T22:19:50.9317548Z   Native Overlay Diff: false
2025-11-07T22:19:50.9317956Z   userxattr: false
2025-11-07T22:19:50.9318310Z  Logging Driver: json-file
2025-11-07T22:19:50.9318708Z  Cgroup Driver: systemd
2025-11-07T22:19:50.9319072Z  Cgroup Version: 2
2025-11-07T22:19:50.9319864Z  Plugins:
2025-11-07T22:19:50.9320217Z   Volume: local
2025-11-07T22:19:50.9320718Z   Network: bridge host ipvlan macvlan null overlay
2025-11-07T22:19:50.9323263Z   Log: awslogs fluentd gcplogs gelf journald json-file local splunk syslog
2025-11-07T22:19:50.9323936Z  Swarm: inactive
2025-11-07T22:19:50.9324389Z  Runtimes: io.containerd.runc.v2 runc
2025-11-07T22:19:50.9324895Z  Default Runtime: runc
2025-11-07T22:19:50.9325301Z  Init Binary: docker-init
2025-11-07T22:19:50.9325905Z  containerd version: b98a3aace656320842a23f4a392a33f46af97866
2025-11-07T22:19:50.9326535Z  runc version: v1.3.0-0-g4ca628d1
2025-11-07T22:19:50.9326976Z  init version: de40ad0
2025-11-07T22:19:50.9327351Z  Security Options:
2025-11-07T22:19:50.9327680Z   apparmor
2025-11-07T22:19:50.9327975Z   seccomp
2025-11-07T22:19:50.9328303Z    Profile: builtin
2025-11-07T22:19:50.9328652Z   cgroupns
2025-11-07T22:19:50.9329010Z  Kernel Version: 6.11.0-1018-azure
2025-11-07T22:19:50.9329473Z  Operating System: Ubuntu 24.04.3 LTS
2025-11-07T22:19:50.9329935Z  OSType: linux
2025-11-07T22:19:50.9330288Z  Architecture: x86_64
2025-11-07T22:19:50.9330666Z  CPUs: 2
2025-11-07T22:19:50.9331006Z  Total Memory: 7.758GiB
2025-11-07T22:19:50.9331626Z  Name: runnervmf2e7y
2025-11-07T22:19:50.9332086Z  ID: 53d5b372-3a00-4865-8d81-0d2be474f41b
2025-11-07T22:19:50.9332625Z  Docker Root Dir: /var/lib/docker
2025-11-07T22:19:50.9333087Z  Debug Mode: false
2025-11-07T22:19:50.9333462Z  Username: githubactions
2025-11-07T22:19:50.9333869Z  Experimental: false
2025-11-07T22:19:50.9334281Z  Insecure Registries:
2025-11-07T22:19:50.9334690Z   ::1/128
2025-11-07T22:19:50.9334994Z   127.0.0.0/8
2025-11-07T22:19:50.9335346Z  Live Restore Enabled: false
2025-11-07T22:19:50.9335640Z 
2025-11-07T22:19:50.9337269Z ##[endgroup]
2025-11-07T22:19:50.9337947Z ##[group]Proxy configuration
2025-11-07T22:19:50.9338462Z No proxy configuration found
2025-11-07T22:19:50.9339124Z ##[endgroup]
2025-11-07T22:19:51.0002958Z ##[group]Buildx version
2025-11-07T22:19:51.0039155Z [command]/usr/bin/docker buildx version
2025-11-07T22:19:51.0516489Z github.com/docker/buildx v0.29.1 a32761aeb3debd39be1eca514af3693af0db334b
2025-11-07T22:19:51.0553483Z ##[endgroup]
2025-11-07T22:19:51.0555852Z ##[group]Builder info
2025-11-07T22:19:51.1797725Z {
2025-11-07T22:19:51.1798470Z   "nodes": [
2025-11-07T22:19:51.1798956Z     {
2025-11-07T22:19:51.1801041Z       "name": "builder-61b66163-73e3-4c5e-a8ec-52fa5a655a6c0",
2025-11-07T22:19:51.1801996Z       "endpoint": "unix:///var/run/docker.sock",
2025-11-07T22:19:51.1802461Z       "status": "running",
2025-11-07T22:19:51.1803456Z       "buildkitd-flags": "--allow-insecure-entitlement security.insecure --allow-insecure-entitlement network.host",
2025-11-07T22:19:51.1804404Z       "buildkit": "v0.25.1",
2025-11-07T22:19:51.1804989Z       "platforms": "linux/amd64,linux/arm64,linux/arm/v7",
2025-11-07T22:19:51.1805530Z       "features": {
2025-11-07T22:19:51.1806163Z         "Automatically load images to the Docker Engine image store": true,
2025-11-07T22:19:51.1806792Z         "Cache export": true,
2025-11-07T22:19:51.1807210Z         "Direct push": true,
2025-11-07T22:19:51.1807661Z         "Docker exporter": true,
2025-11-07T22:19:51.1808144Z         "Multi-platform build": true,
2025-11-07T22:19:51.1808659Z         "OCI exporter": true
2025-11-07T22:19:51.1809042Z       },
2025-11-07T22:19:51.1809354Z       "labels": {
2025-11-07T22:19:51.1809867Z         "org.mobyproject.buildkit.worker.executor": "oci",
2025-11-07T22:19:51.1810604Z         "org.mobyproject.buildkit.worker.hostname": "26dbeb56f074",
2025-11-07T22:19:51.1811567Z         "org.mobyproject.buildkit.worker.network": "host",
2025-11-07T22:19:51.1812378Z         "org.mobyproject.buildkit.worker.oci.process-mode": "sandbox",
2025-11-07T22:19:51.1813220Z         "org.mobyproject.buildkit.worker.selinux.enabled": "false",
2025-11-07T22:19:51.1814084Z         "org.mobyproject.buildkit.worker.snapshotter": "overlayfs"
2025-11-07T22:19:51.1814701Z       },
2025-11-07T22:19:51.1815321Z       "gcPolicy": [
2025-11-07T22:19:51.1815698Z         {
2025-11-07T22:19:51.1816020Z           "all": false,
2025-11-07T22:19:51.1816389Z           "filter": [
2025-11-07T22:19:51.1816817Z             "type==source.local",
2025-11-07T22:19:51.1817294Z             "type==exec.cachemount",
2025-11-07T22:19:51.1817795Z             "type==source.git.checkout"
2025-11-07T22:19:51.1818252Z           ],
2025-11-07T22:19:51.1818632Z           "keepDuration": "48h0m0s"
2025-11-07T22:19:51.1819063Z         },
2025-11-07T22:19:51.1819363Z         {
2025-11-07T22:19:51.1819682Z           "all": false,
2025-11-07T22:19:51.1820114Z           "keepDuration": "1440h0m0s"
2025-11-07T22:19:51.1820510Z         },
2025-11-07T22:19:51.1820792Z         {
2025-11-07T22:19:51.1821091Z           "all": false
2025-11-07T22:19:51.1822840Z         },
2025-11-07T22:19:51.1823134Z         {
2025-11-07T22:19:51.1823435Z           "all": true
2025-11-07T22:19:51.1823793Z         }
2025-11-07T22:19:51.1824081Z       ]
2025-11-07T22:19:51.1824361Z     }
2025-11-07T22:19:51.1824713Z   ],
2025-11-07T22:19:51.1825192Z   "name": "builder-61b66163-73e3-4c5e-a8ec-52fa5a655a6c",
2025-11-07T22:19:51.1825804Z   "driver": "docker-container",
2025-11-07T22:19:51.1826315Z   "lastActivity": "2025-11-07T22:19:21.000Z"
2025-11-07T22:19:51.1826772Z }
2025-11-07T22:19:51.1827392Z ##[endgroup]
2025-11-07T22:19:51.3483634Z [command]/usr/bin/docker buildx build --iidfile /home/runner/work/_temp/docker-actions-toolkit-wL1xwA/build-iidfile-c9bd6a1600.txt --platform linux/amd64,linux/arm64,linux/arm/v7 --attest type=provenance,mode=min,inline-only=true,builder-id=https://github.com/QuantomDevs/QuantomOS/actions/runs/19182754211 --tag ghcr.io/quantomdevs/quantomos:latest --tag ghcr.io/quantomdevs/quantomos:v1.3.2 --metadata-file /home/runner/work/_temp/docker-actions-toolkit-wL1xwA/build-metadata-5d310d8a53.json --push .
2025-11-07T22:19:51.6487693Z #0 building with "builder-61b66163-73e3-4c5e-a8ec-52fa5a655a6c" instance using docker-container driver
2025-11-07T22:19:51.6488656Z 
2025-11-07T22:19:51.6489114Z #1 [internal] load build definition from Dockerfile
2025-11-07T22:19:51.6489753Z #1 transferring dockerfile: 1.67kB done
2025-11-07T22:19:51.6490211Z #1 DONE 0.0s
2025-11-07T22:19:51.6490406Z 
2025-11-07T22:19:51.6490930Z #2 [linux/arm64 internal] load metadata for docker.io/library/node:lts-slim
2025-11-07T22:19:51.8320644Z #2 ...
2025-11-07T22:19:51.8322083Z 
2025-11-07T22:19:51.8322543Z #3 [auth] library/node:pull token for registry-1.docker.io
2025-11-07T22:19:51.8323096Z #3 DONE 0.0s
2025-11-07T22:19:51.9787967Z 
2025-11-07T22:19:51.9789129Z #4 [linux/arm/v7 internal] load metadata for docker.io/library/node:lts-slim
2025-11-07T22:19:52.1282462Z #4 ERROR: no match for platform in manifest: not found
2025-11-07T22:19:52.1284229Z 
2025-11-07T22:19:52.1286204Z #5 [linux/amd64 internal] load metadata for docker.io/library/node:lts-slim
2025-11-07T22:19:52.1836381Z #5 CANCELED
2025-11-07T22:19:52.1836608Z 
2025-11-07T22:19:52.1837238Z #2 [linux/arm64 internal] load metadata for docker.io/library/node:lts-slim
2025-11-07T22:19:52.1839166Z #2 ERROR: ref buildkit/1/index-sha256:76d0ed0ed93bed4f4376211e9d8fddac4d8b3fbdb54cc45955696001a3c91152 locked for 77.7438ms (since 2025-11-07 22:19:52.009739444 +0000 UTC m=+25.738448103): unavailable
2025-11-07T22:19:52.1840473Z ------
2025-11-07T22:19:52.1841045Z  > [linux/arm/v7 internal] load metadata for docker.io/library/node:lts-slim:
2025-11-07T22:19:52.1841873Z ------
2025-11-07T22:19:52.1842140Z ------
2025-11-07T22:19:52.1842679Z  > [linux/arm64 internal] load metadata for docker.io/library/node:lts-slim:
2025-11-07T22:19:52.1843270Z ------
2025-11-07T22:19:52.1882325Z Dockerfile:22
2025-11-07T22:19:52.1885997Z --------------------
2025-11-07T22:19:52.1888546Z   20 |     
2025-11-07T22:19:52.1888970Z   21 |     # Build (Frontend)
2025-11-07T22:19:52.1889462Z   22 | >>> FROM node:lts-slim AS frontend-build
2025-11-07T22:19:52.1889978Z   23 |     WORKDIR /usr/src/app
2025-11-07T22:19:52.1890876Z   24 |     # Copy root package.json for version access
2025-11-07T22:19:52.1891694Z --------------------
2025-11-07T22:19:52.1893344Z ERROR: failed to build: failed to solve: node:lts-slim: failed to resolve source metadata for docker.io/library/node:lts-slim: no match for platform in manifest: not found
2025-11-07T22:19:52.1976212Z ##[error]buildx failed with: ERROR: failed to build: failed to solve: node:lts-slim: failed to resolve source metadata for docker.io/library/node:lts-slim: no match for platform in manifest: not found
2025-11-07T22:19:52.2118724Z Post job cleanup.
2025-11-07T22:19:52.4399309Z ##[group]Removing temp folder /home/runner/work/_temp/docker-actions-toolkit-wL1xwA
2025-11-07T22:19:52.4410814Z ##[endgroup]
2025-11-07T22:19:52.4412286Z ##[group]Post cache
2025-11-07T22:19:52.4413476Z State not set
2025-11-07T22:19:52.4414247Z ##[endgroup]
2025-11-07T22:19:52.4525056Z Post job cleanup.
2025-11-07T22:19:52.7911725Z [command]/usr/bin/docker logout ghcr.io
2025-11-07T22:19:52.8088642Z Removing login credentials for ghcr.io
2025-11-07T22:19:52.8137326Z ##[group]Post cache
2025-11-07T22:19:52.8140075Z State not set
2025-11-07T22:19:52.8143203Z ##[endgroup]
2025-11-07T22:19:52.8331019Z Post job cleanup.
2025-11-07T22:19:53.1278613Z ##[group]Removing builder
2025-11-07T22:19:53.2419553Z [command]/usr/bin/docker buildx rm builder-61b66163-73e3-4c5e-a8ec-52fa5a655a6c
2025-11-07T22:19:54.6424630Z builder-61b66163-73e3-4c5e-a8ec-52fa5a655a6c removed
2025-11-07T22:19:54.6460343Z ##[endgroup]
2025-11-07T22:19:54.6462115Z ##[group]Cleaning up certificates
2025-11-07T22:19:54.6469289Z ##[endgroup]
2025-11-07T22:19:54.6470172Z ##[group]Post cache
2025-11-07T22:19:54.6474244Z State not set
2025-11-07T22:19:54.6474883Z ##[endgroup]
2025-11-07T22:19:54.6593773Z Post job cleanup.
2025-11-07T22:19:54.8989833Z ##[group]Post cache
2025-11-07T22:19:54.8995799Z Caching docker.io--tonistiigi--binfmt-latest-linux-x64 to GitHub Actions cache
2025-11-07T22:19:54.9213075Z [command]/usr/bin/tar --posix -cf cache.tzst --exclude cache.tzst -P -C /home/runner/work/QuantomOS/QuantomOS --files-from manifest.txt --use-compress-program zstdmt
2025-11-07T22:19:55.6313318Z Failed to save: Unable to reserve cache with key docker.io--tonistiigi--binfmt-latest-linux-x64, another job may be creating this cache.
2025-11-07T22:19:55.6383726Z ##[endgroup]
2025-11-07T22:19:55.6541572Z Post job cleanup.
2025-11-07T22:19:55.7513151Z [command]/usr/bin/git version
2025-11-07T22:19:55.7592413Z git version 2.51.2
2025-11-07T22:19:55.7684864Z Temporarily overriding HOME='/home/runner/work/_temp/bcad0c48-04f2-4fb4-aa70-aa3d3ebec047' before making global git config changes
2025-11-07T22:19:55.7690851Z Adding repository directory to the temporary git global config as a safe directory
2025-11-07T22:19:55.7720086Z [command]/usr/bin/git config --global --add safe.directory /home/runner/work/QuantomOS/QuantomOS
2025-11-07T22:19:55.7785791Z [command]/usr/bin/git config --local --name-only --get-regexp core\.sshCommand
2025-11-07T22:19:55.7824571Z [command]/usr/bin/git submodule foreach --recursive sh -c "git config --local --name-only --get-regexp 'core\.sshCommand' && git config --local --unset-all 'core.sshCommand' || :"
2025-11-07T22:19:55.8075757Z [command]/usr/bin/git config --local --name-only --get-regexp http\.https\:\/\/github\.com\/\.extraheader
2025-11-07T22:19:55.8101440Z http.https://github.com/.extraheader
2025-11-07T22:19:55.8120646Z [command]/usr/bin/git config --local --unset-all http.https://github.com/.extraheader
2025-11-07T22:19:55.8155733Z [command]/usr/bin/git submodule foreach --recursive sh -c "git config --local --name-only --get-regexp 'http\.https\:\/\/github\.com\/\.extraheader' && git config --local --unset-all 'http.https://github.com/.extraheader' || :"
2025-11-07T22:19:55.8512189Z Cleaning up orphan processes
