export default sdk => {
  const getProjects = (callback, force = false) => {
    if (this._surveyEventReceiver == null) {
      this._surveyEventReceiver = new SurveyEventReceiver(this.instance)
    }

    const existingSurveys = this.instance.get_property(SURVEYS)

    if (!existingSurveys || forceReload) {
      this.instance._send_request({
        url: this.instance.requestRouter.endpointFor(
          'api',
          `/api/surveys/?token=${this.instance.config.token}`
        ),
        method: 'GET',
        transport: 'XHR',
        callback: response => {
          if (response.statusCode !== 200 || !response.json) {
            return callback([])
          }
          const surveys = response.json.surveys || []

          const eventOrActionBasedSurveys = surveys.filter(
            survey =>
              (survey.conditions?.events &&
                survey.conditions?.events?.values &&
                survey.conditions?.events?.values?.length > 0) ||
              (survey.conditions?.actions &&
                survey.conditions?.actions?.values &&
                survey.conditions?.actions?.values?.length > 0)
          )

          if (eventOrActionBasedSurveys.length > 0) {
            this._surveyEventReceiver?.register(eventOrActionBasedSurveys)
          }

          this.instance.persistence?.register({ [SURVEYS]: surveys })
          return callback(surveys)
        },
      })
    } else {
      return callback(existingSurveys)
    }
  }

  return { getProjects }
}
