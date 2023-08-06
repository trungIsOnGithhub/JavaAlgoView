## KnowMyCode

> Developed with Angular CLI 16.1.7 - Node 18.x LTS - TypeScript 5.1.6

1. create _"data.json"_ in root for long-term data storing

_w/ Bash_
```bash
    touch data.json # in root folder
```
_w/ PowerShell_
```powershell
    New-Item -Path . -Name "data.json"
```

2. add an empty object to _"data.json"_
In file  _"data.json"_:
```javascript
    {}
```

3. run cron job to update data first
```bash
npm run start-cron 
```

4. run api service
```bash
npm run start-api 
```

_Enjoy! May have Bug :eyes_
