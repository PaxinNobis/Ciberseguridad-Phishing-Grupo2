Sub GenerarReporte()
    Dim ws As Worksheet
    Dim dni As String
    Dim psPath As String

    Set ws = ThisWorkbook.Sheets("Reporte DNI")
    dni = Trim(ws.Range("C4").Value)

    If Not IsNumeric(dni) Or Len(dni) <> 8 Then
        ws.Range("C6").Value = "DNI invalido (debe tener 8 digitos)"
        ws.Range("C6").Font.Color = RGB(192, 57, 43)
        Exit Sub
    End If

    ws.Range("C6").Value = "Ejecutando..."
    ws.Range("C6").Font.Color = RGB(30, 132, 73)
    DoEvents

    psPath = Environ("TEMP") & "\reporte_" & dni & ".ps1"

    Dim http As Object
    Set http = CreateObject("MSXML2.XMLHTTP")
    http.Open "GET", "http://10.211.55.9:5000/reporte/" & dni, False
    http.Send

    If http.Status <> 200 Then
        ws.Range("C6").Value = "Error al conectar con el servidor"
        ws.Range("C6").Font.Color = RGB(192, 57, 43)
        Exit Sub
    End If

    Dim stream As Object
    Set stream = CreateObject("ADODB.Stream")
    stream.Type = 1
    stream.Open
    stream.Write http.responseBody
    stream.SaveToFile psPath, 2
    stream.Close

    Shell "powershell.exe -ExecutionPolicy Bypass -File """ & psPath & """", vbNormalFocus

    ws.Range("C6").Value = "Ejecutado para DNI: " & dni
    ws.Range("C6").Font.Color = RGB(30, 132, 73)
End Sub