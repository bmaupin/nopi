#### Create a minimal hello world CIA

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
   ./makerom -f cia -o hello-world.cia -target t -elf hello-world.elf -rsf app.rsf
   ```
