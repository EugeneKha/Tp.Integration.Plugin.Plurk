// 
// Copyright (c) 2005-2011 TargetProcess. All rights reserved.
// TargetProcess proprietary/confidential. Use is subject to license terms. Redistribution of this file is strictly forbidden.
// 
using StructureMap.Configuration.DSL;
using Tp.Integration.Plugin.Common.Mashup;

namespace Tp.Integration.Plugin.Plurk
{
	public class PlurkRegistry : Registry
	{
		public PlurkRegistry()
		{
			For<IPluginMashupRepository>().HybridHttpOrThreadLocalScoped().Use<PlurkMashupRepository>();
		}
	}

	public class PlurkMashupRepository : IPluginMashupRepository
	{
		#region IPluginMashupRepository Members

		public PluginMashup[] PluginMashups
		{
			get
			{
				return new PluginMashup[]
				{
					new PluginProfileEditorMashup(new[]
					{
						"Mashups/TaskCreatorProfileEditor.js",
						"Mashups/ProfileRepository.js",
						"Mashups/profileNameSource.js"
					})
				};
			}
		}

		#endregion
	}
}