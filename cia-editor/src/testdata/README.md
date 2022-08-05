The [`test.cia`](test.cia) file in this directory was just about the smallest CIA file I could create that included an icon and RomFS.

It was created using these steps:

1. Download RSF from [https://gist.github.com/jakcron/9f9f02ffd94d98a72632](https://gist.github.com/jakcron/9f9f02ffd94d98a72632)

   1. Rename it to test.rsf

   1. Change this line:

      ```
      SystemModeExt                 : 128MB
      ```

      to:

      ```
      SystemModeExt                 : 124MB
      ```

   1. Uncomment this line to enable including the RomFS in the CIA:

      ```
      #RootPath                : romfs
      ```

   (This file has been saved to [`test.rsf`](test.rsf) in case the upstream file goes away)

1. Create a small C file

   ```
   echo 'int main(void) { return 42; }' > test.c
   ```

1. Compile it

   ```
   docker run --rm -v "$PWD:/build" devkitpro/devkitarm sh -c "cd /build; /opt/devkitpro/devkitARM/bin/arm-none-eabi-gcc -Wall -s -O3 test.c"
   ```

1. Create a dummy RomFS directory

   ```
   mkdir romfs
   echo test > romfs/test.txt
   ```

1. Create an icon

   1. Create a dummy icon

   1. Use this site to convert it: [https://www.marcrobledo.com/smdh-creator/](https://www.marcrobledo.com/smdh-creator/)

1. Make the NCCH from the ELF, icon, and RomFS

   ```
   makerom -f ncch -o test.ncch -elf a.out -icon icon.smdh -rsf test.rsf
   ```

1. Make the CIA from the NCCH

   ```
   makerom -f cia -o test.cia -content test.ncch:0:0
   ```

#### Re-create the CIA file

I did this to create another file as similar as possible, but with the title ID changed.
Unfortunately the NCCH file can't be reused since the header/exheader contains the title
ID. In addition, it can't be rebuilt because makerom can only rebuild an NCCH when
provided the code, RomFS, and exheader. 3dstool can't create NCCH files without a header.

1. Extract the NCCH from the existing CIA

   ```
   ctrtool --contents=contents test.cia
   mv contents.* test.ncch
   ```

1. Extract ExeFS, logo, RomFS from NCCH

   ```
   3dstool -xtf cxi test.ncch --exefs exefs.bin --logo logo.bin --romfs romfs.bin
   ```

1. Extract code, icon from ExeFS

   ```
   3dstool -xtf exefs exefs.bin --exefs-dir exefs/
   ```

1. Make any changes to the RSF as desired

   e.g. in this case, I changed the title ID

1. Repeat the steps in the previous section to create a new ELF, dummy RomFS, then create the NCCH from those plus the extracted icon. Finally create the CIA

   Alternatively, you can create a new CIA directly from the ELF, icon, RomFS, but **note** that this will use a different content ID inside the TMD for some reason:

   ```
   makerom -f cia -o test3.cia -target t -elf a.out -rsf test.rsf -icon exefs/icon.icn -romfs romfs.bin
   ```
