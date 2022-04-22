#### Resources

- [https://www.3dbrew.org/wiki/CIA](https://www.3dbrew.org/wiki/CIA)

#### CIA header

| Start | Size   | Description                              |
| ----- | ------ | ---------------------------------------- |
| 0x00  | 0x04   | Archive Header Size<br>Usually `0x2020`  |
| 0x04  | 0x02   | Type<br>Usually `0x0`                    |
| 0x06  | 0x02   | Version<br>Usually `0x0`                 |
| 0x08  | 0x04   | Certificate chain size                   |
| 0x0C  | 0x04   | Ticket size                              |
| 0x10  | 0x04   | TMD file size                            |
| 0x14  | 0x04   | Meta size (0 if no Meta data is present) |
| 0x18  | 0x08   | Content size                             |
| 0x20  | 0x2000 | Content Index                            |
