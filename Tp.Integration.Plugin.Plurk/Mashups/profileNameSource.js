function profileNameSource(config) {
    this._create(config);
}

profileNameSource.prototype = {
    _create: function(config) {
    },

    getProfileName: function() {
        return new Tp.URL(window.location.href).getArgumentValue('ProfileName');
    }
};