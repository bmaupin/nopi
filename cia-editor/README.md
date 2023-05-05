#### About

Attempt at a pure TypeScript implementation of a library to modify existing 3DS CIA files.

After first [attempting to write the entire CIA file from scratch](../cia-writer/), it seemed much easier to just take an existing CIA file and modify it as necessary.

For now, the project is on hold as I've grown less fond of the 3DS for emulation (see [Emulation on 3DS | Disadvantages](https://bmaupin.github.io/wiki/other/3ds/emulation-on-3ds.html#disadvantages)) and decided my time would be better spent working on other projects.

#### Goals

22/40 tasks complete (55%)

```
tasks_complete=$(cat README.md | grep "\[x\]" | wc -l)
tasks_total=$((tasks_complete + $(cat README.md | grep "\[ \]" | wc -l)))
echo "$tasks_complete/$tasks_total tasks complete ($((tasks_complete*100/tasks_total))%)"
```

- Header
  - [ ] Write content size
- Ticket
  - [x] Write signature
  - [x] Write title key
  - [x] Write ticket ID
  - [x] Write title ID
- Title metadata
  - [x] Write signature
  - [x] Write title ID
  - [x] Write info record hash
  - [x] Write content chunk hash
  - [ ] Write content size
  - [x] Write content hash
- NCCH
  - [x] Write signature
  - [ ] Write content size
  - [x] Write title ID
  - [x] Write program ID (same as Title ID)
  - [ ] Write product code?
  - [x] Exheader hash
  - [ ] Write ExeFS size? (if ExeFS size changes)
  - [ ] Write ExeFS hash
  - [ ] Write RomFS offset? (if ExeFS size changes)
  - [ ] Write RomFS size
  - [x] Write RomFS hash
- NCCH extended header
  - [x] Signature
  - [x] Write Jump ID (same as Title ID)
  - [x] Write Program ID (same as Title ID)
  - [x] Title ID at 0x4100 (same as Title ID)
- ExeFS
  - [ ] Write file offset? (if file size changes)
  - [ ] Write file size? (if it changes when we change the icon/banner)
  - [ ] Write file hash
  - [ ] Write file content
- RomFS
  - [ ] Write master hashes size
  - [ ] Write level 1 size
  - [ ] Write level 2 size
  - [ ] Write level 3 size
  - [x] Write master hashes
  - [x] Write level 1 hashes
  - [x] Write level 2 hashes
- RomFS file metadata
  - [ ] Write file data offset
  - [ ] Write file data size
- RomFS file data
  - [x] Write content
