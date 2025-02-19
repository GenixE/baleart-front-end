const StarRating = ({rating, setRating}) => {
    return (
        <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
                <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className={`text-2xl ${rating >= star ? 'text-[#149d80]' : 'text-gray-300'}`}>
                    ★
                </button>
            ))}
        </div>
    );
};

export default StarRating;