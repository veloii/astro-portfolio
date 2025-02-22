export function escapeString(value: string) {
	return String(value).replace(/'/g, "\\'");
}
