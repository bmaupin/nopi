#### Goals

21/40 tasks complete (52%)

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
  - [ ] Exheader hash
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
