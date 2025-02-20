import Comment from './Comment';

const CommentsSection = ({comments, currentPage, commentsPerPage, language, openModal, paginate, translations}) => {
    const indexOfLastComment = currentPage * commentsPerPage;
    const indexOfFirstComment = indexOfLastComment - commentsPerPage;
    const currentComments = comments.slice(indexOfFirstComment, indexOfLastComment);

    return (
        <div className="mt-8">
            <h2 className="text-2xl font-semibold mb-6">
                {translations.commentsSection.comments[language]}
            </h2>
            {currentComments.length > 0 ? (
                <div className="space-y-6">
                    {currentComments.map((comment) => (
                        <Comment
                            key={comment.id}
                            comment={comment}
                            language={language}
                            openModal={openModal}
                        />
                    ))}
                </div>
            ) : (
                <p className="text-gray-600">
                    {translations.commentsSection.noComments[language]}
                </p>
            )}

            {comments.length > commentsPerPage && (
                <div className="flex justify-center mt-6">
                    {Array.from({length: Math.ceil(comments.length / commentsPerPage)}, (_, i) => (
                        <button
                            key={i + 1}
                            onClick={() => paginate(i + 1)}
                            className={`mx-1 px-4 py-2 rounded-lg ${
                                currentPage === i + 1 ? 'bg-[#149d80] text-white' : 'bg-gray-200 text-gray-700'
                            }`}
                        >
                            {i + 1}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

export default CommentsSection;