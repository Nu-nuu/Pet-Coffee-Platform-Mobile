import api from './api';

export const reportPost = async (postId, data) => {
    try {
        const response = await api.post(`/api/v1/posts/${postId}/reports`, data);
        return response.data;
    } catch (error) {
        console.error('Error reporting post:', error.response ? error.response.data : 'Network error');
        throw error;
    }
};

export const reportComment = async (commentId, data) => {
    try {
        const response = await api.post(`/api/v1/comments/${commentId}/reports`, data);
        return response.data;
    } catch (error) {
        console.error('Error reporting comment:', error.response ? error.response.data : 'Network error');
        throw error;
    }
};


