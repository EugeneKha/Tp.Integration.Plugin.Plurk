function profileRepository(config) {
    this._create(config);
};

profileRepository.prototype = {
    _requestUrlBase: '/api/v1/Plugins/{PluginName}/Profiles/{ProfileName}',
    _pluginName: null,

    _create: function(config){
        this._pluginName = config.pluginName;
    },

    _getUrl: function(profileName){
        var relativeUrl = this._requestUrlBase.replace(/{PluginName}/g, this._pluginName).replace(/{ProfileName}/g, profileName);
        return new Tp.WebServiceURL(relativeUrl).url
    },

    getByName: function(profileName, success){
        if (profileName){
            $.getJSON(this._getUrl(profileName), success);
        } else {
            success(null);
        }
    },

    _post: function(profileName, data, success, error) {
        $.ajax({
            url: this._getUrl(profileName),
            data: JSON.stringify(data),
            success: success,
            error: function(response) {
                error(JSON.parse(response.responseText))
            },
            type: 'POST',
            dataType: "json"
        });
    },

    create: function(data, success, error){
        this._post('', data, success, error);
    },

    update: function(profileName, data, success, error){
        this._post(profileName, data, success, error);
    }
};
