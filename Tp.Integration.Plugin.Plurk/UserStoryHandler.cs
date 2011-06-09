// 
// Copyright (c) 2005-2010 TargetProcess. All rights reserved.
// TargetProcess proprietary/confidential. Use is subject to license terms. Redistribution of this file is strictly forbidden.
// 
using System;
using System.IO;
using System.Linq;
using System.Runtime.Serialization.Formatters.Binary;
using System.Threading;
using NServiceBus;
using PlurkApi;
using Tp.Integration.Common;
using Tp.Integration.Messages.EntityLifecycle.Messages;
using Tp.Integration.Plugin.Common;
using Tp.Integration.Plugin.Common.Storage;

namespace Tp.Integration.Plugin.Plurk
{
	public class UserStoryHandler : IHandleMessages<UserStoryCreatedMessage>,
	                                                 IHandleMessages<UserStoryUpdatedMessage>
	{
		private readonly ICommandBus _bus;
		private readonly IStorageRepository _storage;
		private readonly PlurkProfile _profile;

		public UserStoryHandler(ICommandBus bus, IStorageRepository storage)
		{
			_bus = bus;
			_storage = storage;
			_profile = _storage.GetProfile<PlurkProfile>();
		}

		public void Handle(UserStoryCreatedMessage message)
		{
			ProcessUserStory(message.Dto);
		}

		public void Handle(UserStoryUpdatedMessage message)
		{
			ProcessUserStory(message.Dto);
		}

		private void ProcessUserStory(UserStoryDTO userStoryDto)
		{
			
			if (PlurkData.PlurkApi == null)
			{
				PlurkData.PlurkApi = new PlurkApi.PlurkApi("NsryjAyoidHKFvkYEUR1zQHrHwMQChgs");
			}

			if (!PlurkData.PlurkApi.isLogged)
			{
				if (!PlurkData.PlurkApi.login("evk", "letmein"))
				{
					return;
				}
			}
			PlurkData.PlurkApi.plurkAdd(lang.en, Qualifier.says, string.Format("UserStory '{0}' added/updated", userStoryDto.Name), "0", string.Empty);
		}
	}
	class PlurkData
	{
		public static PlurkApi.PlurkApi PlurkApi;
	}
}