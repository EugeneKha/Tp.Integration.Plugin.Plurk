// 
// Copyright (c) 2005-2011 TargetProcess. All rights reserved.
// TargetProcess proprietary/confidential. Use is subject to license terms. Redistribution of this file is strictly forbidden.
// 
using System;
using System.Runtime.Serialization;
using Tp.Integration.Messages.ComponentModel;
using Tp.Integration.Plugin.Common;
using Tp.Integration.Plugin.Common.Validation;

namespace Tp.Integration.Plugin.Plurk
{
	[Profile, Serializable]
	[DataContract]
	public class PlurkProfile : IValidatable
	{
		[ProjectId]
		[TPDescription("Select project (the plugin will work for user stories from this project)")]
		[TpCategotyAttribute("Task Creator Settings")]
		[DataMember]
		public int Project { get; set; }

		[TPDescription(
			@"As you add/edit a user story, you should start user story name with special command.
e.g. we've chosen {CT} as a command in profile.<br/>
<em>User Guide</em> is the name of this user story. So, if we put <em>{CT}User Guide</em> to user story name field, 
a set of tasks specified below in 'Tasks List' field will be created<br/> and command <em>{CT}</em> will be cut from user story name."
			), TpCategotyAttribute("Task Creator Settings"), DataMember]
		public string CommandName { get; set; }

		[TextArea]
		[TPDescription("List of tasks to be created. One task per line.")]
		[TpCategotyAttribute("Task Creator Settings")]
		[DataMember]
		public string TasksList { get; set; }

		public void Validate(PluginProfileErrorCollection errors)
		{
			ValidateProject(errors);

			ValidateCommand(errors);

			ValidateTasksList(errors);
		}

		private void ValidateTasksList(PluginProfileErrorCollection errors)
		{
			if(TasksList.IsNullOrWhitespace())
			{
				errors.Add(new PluginProfileError { FieldName = "TasksList", Message = "Tasks name shoud be specified" });
			}
		}

		private void ValidateCommand(PluginProfileErrorCollection errors)
		{
			if(CommandName.IsNullOrWhitespace())
			{
				errors.Add(new PluginProfileError { FieldName = "CommandName", Message = "Command name shoud be specified" });
			}
		}

		private void ValidateProject(PluginProfileErrorCollection errors)
		{
			if(Project <= 0)
			{
				errors.Add(new PluginProfileError{FieldName = "Project", Message = "Project should be specified"});
			}
		}
	}
}