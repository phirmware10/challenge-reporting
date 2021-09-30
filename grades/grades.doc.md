## How the grade works

#### Script
There is a script which runs on start up to download the gades to the local directory
The script splits the students to 5000
The script splits the students into 5000 per file
The aim is to reduce the amount of data the code has to go through so it wont block the thread
```javascript
const studentId = 350
const grades = require('./grades/1-5000.grade.json')
```

While doing this, the grade statistics are also calculated and saved into `/grades/stats.json`


