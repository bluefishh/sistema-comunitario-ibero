class AlertController {
    constructor(alertModel) {
        this.alertModel = alertModel;
    }

    async getAllAlerts(req, res) {
        try {
            const alerts = await this.alertModel.getAll();
            res.render('allAlerts', { alerts });
        } catch (error) {
            res.status(500).send('Error al obtener alertas');
        }
    }

    // Acá va createAlert y getAlertById, también updateAlert y deleteAlert
}

module.exports = AlertController;