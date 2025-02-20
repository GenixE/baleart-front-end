export const NavigationCard = ({ icon, title, description, onClick }) => (
    <button onClick={onClick} className="bg-white shadow rounded-lg p-6 text-left">
        {icon}
        <h2 className="text-xl font-semibold mt-4">{title}</h2>
        <p className="text-gray-600">{description}</p>
    </button>
);