## Create a minimal hello world CIA

#### Create the CIA

1. Build a hello world ELF

   ([https://github.com/devkitPro/3ds-examples/blob/master/graphics/printing/hello-world/source/main.c](https://github.com/devkitPro/3ds-examples/blob/master/graphics/printing/hello-world/source/main.c))

   ```
   docker run --rm -v "$PWD:/build" devkitpro/devkitarm sh -c "cd /opt/devkitpro/examples/3ds/graphics/printing/hello-world; ls -ltr; make; ls -ltr; cp hello-world.* /build"
   ```

1. Download `makerom` from [https://github.com/3DSGuy/Project_CTR/releases](https://github.com/3DSGuy/Project_CTR/releases)

   ⚠ Version v0.18.2 has a segmentation fault; v0.18 seems to work fine

1. Download RSF from [https://gist.github.com/jakcron/9f9f02ffd94d98a72632](https://gist.github.com/jakcron/9f9f02ffd94d98a72632)

   Change this line:

   ```
   SystemModeExt                 : 128MB
   ```

   to:

   ```
   SystemModeExt                 : 124MB
   ```

1. Convert the ELF to CIA

   ```
   makerom -f cia -o hello-world.cia -target t -elf hello-world.elf -rsf app.rsf
   ```

#### Content of the CIA

- Header: 0x00 - 0x2040
- Certificate chain: 0x2040 -
  - First cert: 0x2040 - 0x2440
  - Second: 0x2440 - 0x2740
  - Third: 0x2740 - 0x2a40
- Ticket: 0x2a40 - 0x2d90? + padding = 0x2dc0
- TMD: 0x2dc0 -
  - Signature: 0x2dc0 - 0x2f00
  - Header: 0x2f00 -
    - Content info record hash: 0x2fa4
  - Content info records: 0x2fc4 -
  - Content chunk records: 0x38c4 - 0x38f4
  - Padding > 0x3900
- Content: 0x3900
  - Header: 0x3900 -
