export default function AdminPage() {
    return (
        <div className="p-6">
            <h1 className="text-center text-[2xl] font-bold mb-4">Admin Page</h1>

            <a
                href="/admin-page/add-subspecies"
                className="vis"
            >
                Añadir Subespecie
            </a>
        </div>
    );
}
