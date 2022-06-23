The [`test.cia`](test.cia) file in this directory was just about the smallest CIA file I could create that included a RomFS.

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

1. Create the CIA file

   ```
   makerom -f cia -o test.cia -target t -elf a.out -rsf test.rsf
   ```
