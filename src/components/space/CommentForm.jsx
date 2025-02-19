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
                         submitError
                     }) => {
    if (!isLoggedIn) {
        return (
            <p className="text-gray-600">
                {language === 'EN'
                    ? 'Please log in to leave a comment.'
                    : language === 'ES'
                        ? 'Por favor inicie sesión para comentar.'
                        : 'Si us plau, inicieu sessió per comentar.'}
            </p>
        );
    }

    return (
        <form onSubmit={handleSubmitComment} className="bg-white p-6 rounded-lg shadow-md">
            {submitError && <div className="text-red-500 mb-4">{submitError}</div>}

            <div className="mb-4">
                <label className="block text-gray-700 mb-2">
                    {language === 'EN' ? 'Rating' : language === 'ES' ? 'Valoración' : 'Valoració'}
                </label>
                <StarRating rating={rating} setRating={setRating}/>
            </div>

            <div className="mb-4">
                <label className="block text-gray-700 mb-2">
                    {language === 'EN' ? 'Comment' : language === 'ES' ? 'Comentario' : 'Comentari'}
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
                    {language === 'EN' ? 'Upload Images (optional)' : language === 'ES' ? 'Subir imágenes (opcional)' : 'Pujar imatges (opcional)'}
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
                    (language === 'EN' ? 'Submitting...' : language === 'ES' ? 'Enviando...' : 'Enviant...') :
                    (language === 'EN' ? 'Submit Comment' : language === 'ES' ? 'Enviar comentario' : 'Enviar comentari')}
            </button>
        </form>
    );
};

export default CommentForm;