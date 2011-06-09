tau.mashups.add(function (config) {
    function taskCreatorProfileEditor(config) {
        this._create(config);
    }

    taskCreatorProfileEditor.prototype = {
        template: null,
        placeHolder: null,
        saveBtn: null,
        _projects: null,
        _returnUrl: null,
        showSampleLink: null,
        samplePopup: null,

        _create: function (config) {
            this.placeHolder = config.placeHolder;
            this.repository = config.profileRepository;
            this.profileNameSource = config.profileNameSource;
            this._returnUrl = 'javascript:window.history.back()';

            this.template = '<div>' +
                    '<form method="POST">' +
                    '<h2 class="h2">Task Creator</h2>' +
                    '<p class="note">This plugin automatically creates a number of tasks for a user story as it is added.</p>' +
                    '<div class="task-creator-settings">' +
                    '	<div class="pad-box">' +
                    '		<p class="label">Profile Name&nbsp;<span class="error" name="NameErrorLabel"></span></p>' +
                    '		<input id="profileNameTextBox" type="text" name="Name" class="input" style="width: 275px;" value="${Name}" />' +
                    '	</div>' +
                    '	<div class="separator"></div>' +
                    '	<div class="pad-box">' +
                    '		<h3 class="h3">Task Creator Settings</h3>' +
                    '		<p class="label pt-5">Select Project&nbsp;<span class="error" name="ProjectErrorLabel"></span><br /><span class="small">The plugin will work for user stories from this project.</span></p>' +
                    '		<select class="select" id="projectsDropDown" name="Project">' +
                    '           <option value="0">- Select project -</option>' +
                    '			{{each projects}}<option value="${Id}">${Name}</option>{{/each}}' +
                    '		</select>' +
                    '		<p class="label pt-10">Command Name&nbsp;<span class="error" name="CommandNameErrorLabel"></span><br />' +
                    '			<span class="small">' +
                    '				As you add/edit user story, you should start user story name with' +
                    '				special command. e.g. we\'ve chosen <b>{CT}</b> as a command in profile. So, if we put <b>{CT}User Guide</b> to user story' +
                    '				name field, a set of tasks specified below in \'Task List\' field will be created' +
                    '				and command {CT} will be cut from user story name.' +
                    '			</span>' +
                    '		</p>' +
                    '		<input id="commandNameTextBox" name="CommandName" value="${Settings.CommandName}" type="text" class="input" style="width: 275px;" value="{Type your command name}" />' +
                    '		<p class="label pt-10">Task List&nbsp;<span class="error" name="TasksListErrorLabel"></span><br /><span class="small">List of tasks to be created. One task per line.</span>' +
                    '		<a id="linkSample" class="note" style="font-size: 11px;" href="javascript:void(0);">Example</a></p>' +
                    '       <div id="tasksSample" class="tasksSamplePopup" style="display: none;">' +
                    '<div class="context-popup-uxo-t" style="right: -25px;"></div>' +
                    '<div class="p-10"><img src="../img/plugins/task-creator-example.png" width="242px" height="138px" /></div>' +
                    '</div>' +
                    '<textarea id="tasksListTextArea" name="TasksList" class="textarea" style="width: 100%;" rows="10">${Settings.TasksList}</textarea>' +
                    '	</div>' +
                    '</div>' +
                    '<div class="save-block">' +
                    '	<a href="javascript:void(0);" id="saveButton" class="button" style="font-size: 13px; font-weight: bold;">Save & Exit</a>' +
                    '	<a href="' + this._returnUrl + '" style="color: #666; padding-left: 10px;">Cancel</a>' +
                    '</div>' +
                    '</form>' +
                    '</div>';
        },



        render: function () {
            var profileEditor = this;
            $.getJSON(new Tp.WebServiceURL('/api/v1/Projects/?include=[Id,Name]').url, $.proxy(this._onProjectsReceived, this));
        },

        _onProjectsReceived: function (projects) {
            this._projects = projects;
            this.repository.getByName(this._getEditingProfileName(), $.proxy(this._renderProfile, this));
        },

        _getEditingProfileName: function () {
            return this.profileNameSource.getProfileName();
        },

        _renderProfile: function (profile) {
            profile = profile || { Name: null, Settings: { CommndName: null, TasksList: null} };
            profile.projects = this._projects;
            this.placeHolder.html('');

            $.tmpl(this.template, profile).appendTo(this.placeHolder);

            this.saveBtn = this.placeHolder.find('#saveButton');
            this.saveBtn.click($.proxy(this._saveProfile, this));

            this.showSampleLink = this.placeHolder.find('#linkSample');
            this.samplePopup = this.placeHolder.find('#tasksSample');

            $('body').click($.proxy(this._toggleSamplePopup, this));

            this._setSelectedProject(profile);

            this._setFocus(profile.Name);
        },

        _setFocus: function(name) {
            var nameInput = this.placeHolder.find('#profileNameTextBox');

            if (name != null) {
                this.placeHolder.find('#tasksListTextArea').focus();
                nameInput.attr('disabled', true);
            }
            else {
                nameInput.focus();
            }
        },

        _toggleSamplePopup: function(e) {
            if ($(e.target).get(0) == this.showSampleLink.get(0)) {
                this._setPopupPosition();
                this.samplePopup.toggle();
            }
            else {
                this._hideSamplePopup();
            }
        },

        _setPopupPosition: function() {
            var position = this.showSampleLink.position();
            this.samplePopup.css('left', position.left);
            this.samplePopup.css('top', position.top + 25);
        },

        _hideSamplePopup: function() {
            if (this.samplePopup.is(':visible')) {
                this.samplePopup.hide();
            }
        },

        _setSelectedProject: function (profile) {
            if (profile.Name) {
                $("#projectsDropDown").val(profile.Settings.Project);
            }
        },

        _saveProfile: function () {
            var project = this.placeHolder.find('#projectsDropDown').val();
            if (project == null)
                project = 0;

            var profile =
            {
                Name: this.placeHolder.find('#profileNameTextBox').val(),
                Settings:
                {
                    Project: project,
                    CommandName: this.placeHolder.find('#commandNameTextBox').val(),
                    TasksList: this.placeHolder.find('#tasksListTextArea').val()
                }
            };

            this.saveBtn.attr('disabled', true);

            if (this._getEditingProfileName()) {
                this.repository.update(this._getEditingProfileName(), profile, $.proxy(this._onProfileSaved, this), $.proxy(this._onProfileSavingFail, this));
            }
            else {
                this.repository.create(profile, $.proxy(this._onProfileSaved, this), $.proxy(this._onProfileSavingFail, this));
            }
        },

        _onProfileSaved: function () {
            window.location.href = this._returnUrl;
        },


        _onProfileSavingFail: function (data) {
            this._clearErrors();
            $(data).each($.proxy(this._showError, this));

            this.saveBtn.attr('disabled', false);
        },

        _clearErrors: function() {
            this.placeHolder.find('input').removeClass('error');
            this.placeHolder.find('textarea').removeClass('error');
            this.placeHolder.find('select').removeClass('error');
            this.placeHolder.find('[name*="ErrorLabel"]').html('');

        },

        _showError: function (index, error) {
            this.placeHolder.find('*[name="' + error.FieldName + '"]').addClass('error');
            this.placeHolder.find('*[name="' + error.FieldName + 'ErrorLabel"]').html(error.Message);
        }
    };

    var profileEditor = new taskCreatorProfileEditor({
        placeHolder: $('#' + config.placeholderId),
        profileRepository: new profileRepository({ pluginName: 'Plurk' }),
        profileNameSource: new profileNameSource()
    }).render();
})