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
  - extended header (https://www.3dbrew.org/wiki/NCCH/Extended_Header#Main_Structure)
    - SCI: 0x3b00 -
    - ACI: 0x3d00 -
    - signature: 0x3f00 -
    - public key: 0x4000 -
    - "ACI (for limitation of first ACI)": 0x4100 -
  - access descriptor? 0x4300?
  - .code: 0x6300? - 0x21be8? (hello world)
  - IVFC (hello world): 0x22900 -

#### Create a hello world CIA with a RomFS

1. Copy app.rsf

   ```
   cp app.rsf romfs.rsf
   ```

1. Edit romfs.rsf

   ```
   RootPath                : romfs:/test.txt
   ```

1. Create the RomFS

   ```
   mkdir romfs
   echo test > romfs/test.txt
   3dstool -ctf romfs romfs.bin --romfs-dir romfs/
   ```

1. Make the NCCH from the ELF plus the RomFS

   ```
   makerom -f ncch -o hello-world.ncch -elf ../hello-world.elf -romfs romfs.bin -rsf romfs.rsf
   ```

1. Make the CIA from the NCCH

   ```
   makerom -f cia -o hello-world.cia -content hello-world.ncch:0:0
   ```

<!-- 1. Extract the previously-built CIA

   ```
   ctrtool --contents=contents ../hello-world.cia
   mv contents.* contents.bin
   3dstool -xtf cxi contents.bin --header header.bin --exh exheader.bin --exefs exefs.bin --logo logo.bin
   ```

1. Create a new CIA file

   ```
   makerom -f cia -o romfs.cia -code exefs.bin -romfs romfs.bin -exheader exheader.bin -rsf romfs.rsf
   ``` -->

## Create a test RetroArch CIA + ROM

1. Download the Retroarch RSF template

   [https://github.com/libretro/RetroArch/blob/master/pkg/ctr/tools/template.rsf](https://github.com/libretro/RetroArch/blob/master/pkg/ctr/tools/template.rsf)

1. Modify the RSF file

   1. Replace all variables with values from [https://github.com/libretro/RetroArch/blob/master/pkg/ctr/Makefile.cores](https://github.com/libretro/RetroArch/blob/master/pkg/ctr/Makefile.cores)

      e.g. replace `$(APP_TITLE)` with `Gambatte Libretro`

   1. Add this section after `BasicInfo`

      ```
      RomFs:
        RootPath                : romfs
      ```

1. Create CIA with NSUI

1. Extract the NSUI RomFS

   ```
   ctrtool --contents=contents ../nsui.cia
   mv contents.* contents.bin
   3dstool -xtf cxi contents.bin --romfs romfs.bin
   ```

1. ~~Download RetroArch core from [https://buildbot.libretro.com/nightly/nintendo/3ds/latest/cia/](https://buildbot.libretro.com/nightly/nintendo/3ds/latest/cia/)~~

1. Build a RetroArch core with patches for RomFS

   The pre-built RetroArch cores can't load files from RomFS

1. Extract the RetroArch core contents

   ```
   ctrtool --contents=contents /path/to/retroarch_3ds.cia
   mv contents.0000.* contents-retroarch.bin
   3dstool -xtf cxi contents-retroarch.bin --header header.bin --exh exheader.bin --exefs exefs.bin --logo logo.bin
   ```

1. Extract the RetroArch core ExeFS

   ```
   3dstool -xutf exefs exefs.bin --exefs-dir exefsdir --header header.bin
   ```

1. Rebuild NCCH from RetroArch ExeFS and NSUI RomFS

   ```
   makerom -f ncch -o retroarch.ncch -code exefsdir/code.bin -banner exefsdir/banner.bnr -icon exefsdir/icon.icn -logo exefsdir/logo.darc.lz -exefslogo -exheader exheader.bin -romfs romfs.bin -rsf ../retroarch.rsf
   ```

1. Make the CIA from the NCCH

   ```
   makerom -f cia -o retroarch-romfs.cia -content retroarch.ncch:0:0
   ```

#### RomFS

- dummy rom.bin
  - name: ~0x4a0a60
  - content: 0x4a0b80 - 0x4ab90
- rebuilt
  - name: ~0x4a0a60
  - content: 0x4a0e30 - 0x4e0b90
  - followed by same PNG file

## Differences between CIA files

#### Re-create CIA file with same NCCH

- Ticket
  - Signature
  - Title key
  - Ticket ID

#### Re-create CIA file with same NCCH and different title ID

- Ticket
  - Signature
  - Title key
  - Ticket ID
  - Title ID
- TMD
  - Signature
  - Title ID
  - Content info
    - ~~Content ID~~ (This only seems to change when making a CIA directly from an ELF instead of using an intermediate NCCH)
    - Hash
- NCCH
  - Signature
  - Title ID
  - Program ID
  - Exheader hash
- Exheader
  - Signature
  - Jump ID
  - Program ID
