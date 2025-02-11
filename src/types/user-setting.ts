export type UserSettings = Readonly<{
	defaultView: 'list' | 'grid';
	theme: 'light' | 'dark' | 'system';
	autoMarkAsRead: boolean;
	notificationsEnabled: boolean;
	refreshInterval: number; // 分単位
}>;
