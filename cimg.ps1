Add-Type -AssemblyName System.Windows.Forms
$clipboardImage = [Windows.Forms.Clipboard]::GetImage()
if ($clipboardImage -ne $null) {
  $outputFilePath = Join-Path $Env:TMP (New-Guid).Guid
  $clipboardImage.Save($outputFilePath)
  type $outputFilePath | openssl base64
  del $outputFilePath
}
