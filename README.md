# Github Actions

## Upload To S3
Upload file or folder (will be zipped) to AWS S3 bucket

### Inputs
- srcPath
    - path of source file(s)
- bucket
    - AWS S3 bucket name
- filename
    - destination filename in S3 bucket

### Outputs
- md5
    - md5 of upload file

***

## Download From S3
Download file(s) from AWS S3 bucket

### Inputs
- bucket
  - AWS S3 bucket name
- filePath
  - file path of the download file

### Outputs
- md5
  - md5 of download file

***

## Unity Builder
Build Unity projects

### Inputs
- editorPath (optional)
  - description: 'Path to your Unity.exe. Default is "C:/Program Files/Unity/Hub/Editor/${unity_version}/Editor/Unity.exe"'
