import { parseYaml, Plugin } from "obsidian";

// Remember to rename these classes and interfaces!

interface MyPluginSettings {
	mySetting: string;
}

const DEFAULT_SETTINGS: MyPluginSettings = {
	mySetting: "default",
};

export default class MyPlugin extends Plugin {
	settings: MyPluginSettings;

	async onload() {
		await this.loadSettings();
		this.addCommand({
			id: "add-to-things",
			name: "Add to Things",
			callback: () => {
				const noteFile = this.app.workspace.getActiveFile();
				if (!noteFile.name) return;

				this.app.vault.read(noteFile).then((note) => {
					const note_property = parseYaml(note.split("---")[1]);
					const obsidian_uri = encodeURIComponent(
						`obsidian://advanced-uri?vault=${noteFile.vault.getName()}&uid=${
							note_property.id
						}`
					);
					window.open(
						`things:///add?title=${noteFile.basename}&notes=${obsidian_uri}&show-quick-entry=true`
					);
				});
			},
		});
		this.registerEvent(
			this.app.workspace.on("file-menu", (menu, file, source) => {
				if (
					!(
						source === "more-options" ||
						source === "tab-header" ||
						source == "file-explorer-context-menu"
					)
				) {
					return;
				}

				menu.addItem((item) => {
					item.setTitle(`Add to Things`)
						.setIcon("link")
						.setSection("info")
						.onClick((_) => {
							this.app.vault.read(file).then((note) => {
								const note_property = parseYaml(
									note.split("---")[1]
								);
								const obsidian_uri = encodeURIComponent(
									`obsidian://advanced-uri?vault=${file.vault.getName()}&uid=${
										note_property.id
									}`
								);
								window.open(
									`things:///add?title=${file.basename}&notes=${obsidian_uri}&show-quick-entry=true`
								);
							});
						});
				});
			})
		);
		// When registering intervals, this function will automatically clear the interval when the plugin is disabled.
		this.registerInterval(
			window.setInterval(() => console.log("setInterval"), 5 * 60 * 1000)
		);
	}

	onunload() {}

	async loadSettings() {
		this.settings = Object.assign(
			{},
			DEFAULT_SETTINGS,
			await this.loadData()
		);
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}
