export default function findParent (acid, parent) {
	//console.log(parent)
	const len = acid.length - 2
	while (len != parent.key.length) {
		parent = parent.children.find(w => !acid.indexOf(w.key))
	}
	return parent
}
