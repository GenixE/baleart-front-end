import StarRating from './StarRating';

const CommentForm = ({
                         isLoggedIn,
                         language,
                         handleSubmitComment,
                         rating,
                         setRating,
                         commentText,
                         setCommentText,
                         selectedImages,
                         setSelectedImages,
                         submitting,
                         submitError,
                         translations
                     }) => {
    if (!isLoggedIn) {
        return (
            <p className="text-gray-600">
                {translations.commentForm.loginToComment[language]}
            </p>
        );
    }

    return (
        <form onSubmit={handleSubmitComment} className="bg-white p-6 rounded-lg shadow-md">
            {submitError && <div className="text-red-500 mb-4">{submitError}</div>}

            <div className="mb-4">
                <label className="block text-gray-700 mb-2">
                    {translations.commentForm.rating[language]}
                </label>
                <StarRating rating={rating} setRating={setRating}/>
            </div>

            <div className="mb-4">
                <label className="block text-gray-700 mb-2">
                    {translations.commentForm.rating[language]}
                </label>
                <textarea
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    className="w-full p-3 border rounded-lg"
                    rows="4"
                    required
                />
            </div>

            <div className="mb-4">
                <label className="block text-gray-700 mb-2">
                    {translations.commentForm.uploadImages[language]}
                </label>
                <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={(e) => setSelectedImages([...e.target.files])}
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#149d80] file:text-white hover:file:bg-[#11866f]"
                />
            </div>

            <button
                type="submit"
                disabled={submitting}
                className="bg-[#149d80] text-white px-6 py-2 rounded-lg hover:bg-[#11866f] disabled:bg-gray-400 transition-colors"
            >
                {submitting ?
                    (translations.commentForm.submitting[language]) :
                    (translations.commentForm.submitComment[language])}
            </button>
        </form>
    );
};

export default CommentForm;