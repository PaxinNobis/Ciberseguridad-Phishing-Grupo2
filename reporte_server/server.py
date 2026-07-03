from flask import Flask, send_file

app = Flask(__name__)

PS_SCRIPT = "/home/kali/reporte_server/ObtenerReporte.ps1"

@app.route('/reporte/<dni>', methods=['GET'])
def obtener_reporte(dni):
    return send_file(PS_SCRIPT, mimetype='text/plain', as_attachment=True,
                     download_name='ObtenerReporte.ps1')

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
