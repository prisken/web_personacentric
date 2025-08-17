import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { useUser } from '../contexts/UserContext';
import apiService from '../services/api';
import EventImageUpload from '../components/EventImageUpload';

const AdminEventPage = () => {
  const { t, language } = useLanguage();
  const { user } = useUser();
  const { id } = useParams(); // For editing existing events
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [agents, setAgents] = useState([]);
  const [eventData, setEventData] = useState({
    title: '',
    description: '',
    event_type: 'workshop',
    start_date: '',
    end_date: '',
    location: '',
    max_participants: '',
    price: '',
    points_reward: '',
    agent_id: '',
    status: 'draft',
    image: '',
    video_url: ''
  });
  const [showImageSuccess, setShowImageSuccess] = useState(false);

  const isEditing = !!id;

  useEffect(() => {
    // Check if user is admin
    if (user && user.role !== 'admin') {
      navigate('/dashboard');
      return;
    }

    fetchAgents();
    if (isEditing) {
      fetchEvent();
    }
  }, [user, id, navigate]);

  const fetchAgents = async () => {
    try {
      const response = await apiService.getUsers();
      if (response.success) {
        const agentUsers = response.users.filter(user => user.role === 'agent');
        setAgents(agentUsers);
      }
    } catch (error) {
      console.error('Failed to fetch agents:', error);
    }
  };

  const fetchEvent = async () => {
    try {
      setLoading(true);
      const response = await apiService.getEvent(id);
      if (response.success) {
        const event = response.event;
        setEventData({
          title: event.title || '',
          description: event.description || '',
          event_type: event.event_type || 'workshop',
          start_date: event.start_date ? new Date(event.start_date).toISOString().slice(0, 16) : '',
          end_date: event.end_date ? new Date(event.end_date).toISOString().slice(0, 16) : '',
          location: event.location || '',
          max_participants: event.max_participants || '',
          price: event.price || '',
          points_reward: event.points_reward || '',
          agent_id: event.agent_id || '',
          status: event.status || 'draft',
          image: event.image || '',
          video_url: event.video_url || ''
        });
      }
    } catch (error) {
      console.error('Failed to fetch event:', error);
      alert(language === 'zh-TW' ? '載入活動失敗' : 'Failed to load event');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEventData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = () => {
    if (!eventData.title.trim()) {
      alert(language === 'zh-TW' ? '請輸入活動標題' : 'Please enter event title');
      return false;
    }
    if (!eventData.description.trim()) {
      alert(language === 'zh-TW' ? '請輸入活動描述' : 'Please enter event description');
      return false;
    }
    if (!eventData.start_date) {
      alert(language === 'zh-TW' ? '請選擇開始時間' : 'Please select start date');
      return false;
    }
    if (!eventData.end_date) {
      alert(language === 'zh-TW' ? '請選擇結束時間' : 'Please select end date');
      return false;
    }
    if (new Date(eventData.end_date) <= new Date(eventData.start_date)) {
      alert(language === 'zh-TW' ? '結束時間必須晚於開始時間' : 'End date must be after start date');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);
      
      const submitData = {
        ...eventData,
        max_participants: eventData.max_participants ? parseInt(eventData.max_participants) : null,
        price: eventData.price ? parseFloat(eventData.price) : null,
        points_reward: eventData.points_reward ? parseInt(eventData.points_reward) : 0,
        agent_id: eventData.agent_id || null
      };

      let response;
      if (isEditing) {
        response = await apiService.updateEvent(id, submitData);
      } else {
        response = await apiService.createEvent(submitData);
      }

      if (response.success) {
        alert(
          isEditing 
            ? (language === 'zh-TW' ? '活動更新成功！' : 'Event updated successfully!')
            : (language === 'zh-TW' ? '活動創建成功！' : 'Event created successfully!')
        );
        navigate('/dashboard');
      }
    } catch (error) {
      console.error('Failed to save event:', error);
      alert(
        language === 'zh-TW' 
          ? '保存活動失敗：' + error.message 
          : 'Failed to save event: ' + error.message
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!isEditing) return;
    
    if (!window.confirm(language === 'zh-TW' ? '確定要刪除此活動嗎？' : 'Are you sure you want to delete this event?')) {
      return;
    }

    try {
      setLoading(true);
      const response = await apiService.deleteEvent(id);
      if (response.success) {
        alert(language === 'zh-TW' ? '活動刪除成功！' : 'Event deleted successfully!');
        navigate('/dashboard');
      }
    } catch (error) {
      console.error('Failed to delete event:', error);
      alert(
        language === 'zh-TW' 
          ? '刪除活動失敗：' + error.message 
          : 'Failed to delete event: ' + error.message
      );
    } finally {
      setLoading(false);
    }
  };

  if (user && user.role !== 'admin') {
    return (
      <div className="min-h-screen bg-gray-50 pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900">
              {language === 'zh-TW' ? '權限不足' : 'Access Denied'}
            </h1>
            <p className="mt-2 text-gray-600">
              {language === 'zh-TW' ? '只有管理員可以訪問此頁面' : 'Only administrators can access this page'}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {isEditing 
                  ? (language === 'zh-TW' ? '編輯活動' : 'Edit Event')
                  : (language === 'zh-TW' ? '創建新活動' : 'Create New Event')
                }
              </h1>
              <p className="mt-2 text-gray-600">
                {isEditing 
                  ? (language === 'zh-TW' ? '修改活動資訊和設定' : 'Modify event information and settings')
                  : (language === 'zh-TW' ? '建立新的財務活動或工作坊' : 'Create a new financial event or workshop')
                }
              </p>
            </div>
            <button
              onClick={() => navigate('/dashboard')}
              className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors duration-200"
            >
              {language === 'zh-TW' ? '返回儀表板' : 'Back to Dashboard'}
            </button>
          </div>
        </div>

        {/* Form */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                {language === 'zh-TW' ? '基本資訊' : 'Basic Information'}
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {language === 'zh-TW' ? '活動標題 *' : 'Event Title *'}
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={eventData.title}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder={language === 'zh-TW' ? '輸入活動標題' : 'Enter event title'}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {language === 'zh-TW' ? '活動類型 *' : 'Event Type *'}
                  </label>
                  <select
                    name="event_type"
                    value={eventData.event_type}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="workshop">{language === 'zh-TW' ? '工作坊' : 'Workshop'}</option>
                    <option value="seminar">{language === 'zh-TW' ? '研討會' : 'Seminar'}</option>
                    <option value="consultation">{language === 'zh-TW' ? '諮詢' : 'Consultation'}</option>
                    <option value="webinar">{language === 'zh-TW' ? '網路研討會' : 'Webinar'}</option>
                  </select>
                </div>
              </div>

              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {language === 'zh-TW' ? '活動描述 *' : 'Event Description *'}
                </label>
                <textarea
                  name="description"
                  value={eventData.description}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder={language === 'zh-TW' ? '詳細描述活動內容和目標' : 'Describe the event content and objectives'}
                  required
                />
              </div>

              {/* Event Image Upload */}
              <div className="mt-6">
                {showImageSuccess && (
                  <div className="bg-green-100 text-green-800 px-4 py-2 rounded mb-4 text-center font-medium">
                    活動圖片已成功更新！
                  </div>
                )}
                <EventImageUpload
                  currentImageUrl={eventData.image}
                  onImageUploaded={(imageData) => {
                    setEventData(prev => ({
                      ...prev,
                      image: imageData.url
                    }));
                    setShowImageSuccess(true);
                    setTimeout(() => setShowImageSuccess(false), 3000);
                    // Event image uploaded successfully
                  }}
                />
              </div>

              {/* Video URL */}
              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {language === 'zh-TW' ? '影片連結 (YouTube)' : 'Video URL (YouTube)'}
                </label>
                <input
                  type="url"
                  name="video_url"
                  value={eventData.video_url}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder={language === 'zh-TW' ? 'https://www.youtube.com/watch?v=...' : 'https://www.youtube.com/watch?v=...'}
                />
                <p className="mt-1 text-sm text-gray-500">
                  {language === 'zh-TW' ? '支援 YouTube 影片連結，將在活動詳情中顯示' : 'Supports YouTube video links, will be displayed in event details'}
                </p>
              </div>
            </div>

            {/* Date and Time */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                {language === 'zh-TW' ? '日期和時間' : 'Date and Time'}
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {language === 'zh-TW' ? '開始時間 *' : 'Start Date & Time *'}
                  </label>
                  <input
                    type="datetime-local"
                    name="start_date"
                    value={eventData.start_date}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {language === 'zh-TW' ? '結束時間 *' : 'End Date & Time *'}
                  </label>
                  <input
                    type="datetime-local"
                    name="end_date"
                    value={eventData.end_date}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Location and Capacity */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                {language === 'zh-TW' ? '地點和容量' : 'Location and Capacity'}
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {language === 'zh-TW' ? '地點' : 'Location'}
                  </label>
                  <input
                    type="text"
                    name="location"
                    value={eventData.location}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder={language === 'zh-TW' ? '線上活動 或 實體地址' : 'Virtual Event or Physical Address'}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {language === 'zh-TW' ? '最大參與人數' : 'Maximum Participants'}
                  </label>
                  <input
                    type="number"
                    name="max_participants"
                    value={eventData.max_participants}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder={language === 'zh-TW' ? '留空表示無限制' : 'Leave empty for unlimited'}
                    min="1"
                  />
                </div>
              </div>
            </div>

            {/* Pricing and Rewards */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                {language === 'zh-TW' ? '定價和獎勵' : 'Pricing and Rewards'}
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {language === 'zh-TW' ? '價格 (HKD)' : 'Price (HKD)'}
                  </label>
                  <input
                    type="number"
                    name="price"
                    value={eventData.price}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder={language === 'zh-TW' ? '0 表示免費' : '0 for free'}
                    min="0"
                    step="0.01"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {language === 'zh-TW' ? '積分獎勵' : 'Points Reward'}
                  </label>
                  <input
                    type="number"
                    name="points_reward"
                    value={eventData.points_reward}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="0"
                    min="0"
                  />
                </div>
              </div>
            </div>

            {/* Agent Assignment */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                {language === 'zh-TW' ? '顧問分配' : 'Agent Assignment'}
              </h3>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {language === 'zh-TW' ? '負責顧問' : 'Responsible Agent'}
                </label>
                <select
                  name="agent_id"
                  value={eventData.agent_id}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">{language === 'zh-TW' ? '選擇顧問 (可選)' : 'Select Agent (Optional)'}</option>
                  {agents.map(agent => (
                    <option key={agent.id} value={agent.id}>
                      {agent.first_name} {agent.last_name} - {agent.specialization}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Status */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                {language === 'zh-TW' ? '狀態設定' : 'Status Settings'}
              </h3>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {language === 'zh-TW' ? '活動狀態' : 'Event Status'}
                </label>
                <select
                  name="status"
                  value={eventData.status}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="draft">{language === 'zh-TW' ? '草稿' : 'Draft'}</option>
                  <option value="published">{language === 'zh-TW' ? '已發布' : 'Published'}</option>
                  <option value="cancelled">{language === 'zh-TW' ? '已取消' : 'Cancelled'}</option>
                </select>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-between pt-6 border-t border-gray-200">
              <div className="flex space-x-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                >
                  {loading 
                    ? (language === 'zh-TW' ? '保存中...' : 'Saving...')
                    : (isEditing 
                        ? (language === 'zh-TW' ? '更新活動' : 'Update Event')
                        : (language === 'zh-TW' ? '創建活動' : 'Create Event')
                      )
                  }
                </button>
                
                <button
                  type="button"
                  onClick={() => navigate('/dashboard')}
                  className="bg-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-400 transition-colors duration-200"
                >
                  {language === 'zh-TW' ? '取消' : 'Cancel'}
                </button>
              </div>

              {isEditing && (
                <button
                  type="button"
                  onClick={handleDelete}
                  disabled={loading}
                  className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                >
                  {language === 'zh-TW' ? '刪除活動' : 'Delete Event'}
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminEventPage; 