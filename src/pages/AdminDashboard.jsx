import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../services/api';
import { Button, Card, Badge, Input, Select, Modal, Textarea } from '../components/UI';
import { useAuth } from '../context/AuthContext';
import {
  Users,
  BookOpen,
  ShieldCheck,
  Plus,
  UserCheck,
  Activity,
  Search,
  Lock,
  Unlock,
  Trash2,
  Edit,
  Eye,
  BarChart2,
  Calendar,
  Layers,
  Globe,
  CheckCircle2,
  XCircle,
  AlertTriangle,
} from 'lucide-react';
import toast from 'react-hot-toast';

export const AdminDashboard = () => {
  const { user: currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'users' | 'courses' | 'categories' | 'analytics'
  const [loading, setLoading] = useState(true);

  // Stats Data
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalStudents: 0,
    totalAdmins: 0,
    totalCourses: 0,
    totalCategories: 0,
    totalVisitors: 0,
    todayVisitors: 0,
    weeklyVisitors: 0,
    monthlyVisitors: 0,
    recentUsers: [],
    recentCourses: [],
  });

  // Visitor Analytics Chart Data
  const [visitorAnalytics, setVisitorAnalytics] = useState({
    daily: [],
    weekly: [],
    monthly: [],
  });

  // User Management State
  const [users, setUsers] = useState([]);
  const [userSearch, setUserSearch] = useState('');
  const [userRoleFilter, setUserRoleFilter] = useState('all');
  const [userStatusFilter, setUserStatusFilter] = useState('all');
  const [selectedUserDetail, setSelectedUserDetail] = useState(null);

  // Sorting, Pagination & CRUD Modals State
  const [sortField, setSortField] = useState('name');
  const [sortDirection, setSortDirection] = useState('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  // Independent Create User State
  const [createUserModalOpen, setCreateUserModalOpen] = useState(false);
  const [createUserForm, setCreateUserForm] = useState({
    name: '',
    email: '',
    role: 'student',
    password: '',
    confirmPassword: '',
  });

  // Independent Edit User State
  const [editUserModalOpen, setEditUserModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [editUserForm, setEditUserForm] = useState({
    name: '',
    email: '',
    role: 'student',
    password: '',
    confirmPassword: '',
    isBlocked: false,
  });

  // Multi-Select Grant State
  const [grantModalOpen, setGrantModalOpen] = useState(false);
  const [grantCourseId, setGrantCourseId] = useState('');
  const [selectedUserIdsForGrant, setSelectedUserIdsForGrant] = useState([]);

  // Category Management State
  const [categories, setCategories] = useState([]);
  const [categoryModalOpen, setCategoryModalOpen] = useState(false);
  const [catName, setCatName] = useState('');
  const [catDesc, setCatDesc] = useState('');
  const [editingCategory, setEditingCategory] = useState(null);

  // Course Management State
  const [courses, setCourses] = useState([]);
  const [courseModalOpen, setCourseModalOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);
  const [courseForm, setCourseForm] = useState({
    title: '',
    description: '',
    teachingMethodology: '',
    difficulty: 'Beginner',
    category: '',
    accessType: 'PRIVATE',
    requirements: '',
    learningOutcomes: '',
    thumbnailUrl: '',
    videoUrl: '',
  });
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [videoFile, setVideoFile] = useState(null);
  const [submittingCourse, setSubmittingCourse] = useState(false);

  const [thumbnailUploading, setThumbnailUploading] = useState(false);
  const [thumbnailProgress, setThumbnailProgress] = useState(0);
  const [thumbnailSuccess, setThumbnailSuccess] = useState(false);
  const [thumbnailInfo, setThumbnailInfo] = useState(null);
  const [thumbnailPreview, setThumbnailPreview] = useState('');

  const [videoUploading, setVideoUploading] = useState(false);
  const [videoProgress, setVideoProgress] = useState(0);
  const [videoSuccess, setVideoSuccess] = useState(false);
  const [videoInfo, setVideoInfo] = useState(null);

  // Fetch Stats & Core Admin Data
  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [statsRes, analyticsRes, usersRes, categoriesRes, coursesRes] = await Promise.all([
        API.get('/admin/stats'),
        API.get('/visitors/analytics').catch(() => ({ data: { daily: [], weekly: [], monthly: [] } })),
        API.get('/admin/users'),
        API.get('/categories'),
        API.get('/courses'),
      ]);

      setStats(statsRes.data);
      setVisitorAnalytics(analyticsRes.data);
      setUsers(usersRes.data);
      setCategories(categoriesRes.data);
      setCourses(coursesRes.data);
    } catch (err) {
      toast.error('Failed to load admin console data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // Filter Users
  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(userSearch.toLowerCase()) ||
      u.email.toLowerCase().includes(userSearch.toLowerCase());
    const matchesRole = userRoleFilter === 'all' || u.role === userRoleFilter;
    const matchesStatus =
      userStatusFilter === 'all' ||
      (userStatusFilter === 'blocked' && u.isBlocked) ||
      (userStatusFilter === 'active' && !u.isBlocked);
    return matchesSearch && matchesRole && matchesStatus;
  });

  // Sort Handler
  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // Reset pagination on filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [userSearch, userRoleFilter, userStatusFilter, sortField, sortDirection]);

  // Sort & Paginated Logic
  const sortedUsers = [...filteredUsers].sort((a, b) => {
    let aVal = a[sortField] || '';
    let bVal = b[sortField] || '';

    if (sortField === 'createdAt' || sortField === 'lastLogin') {
      aVal = aVal ? new Date(aVal).getTime() : 0;
      bVal = bVal ? new Date(bVal).getTime() : 0;
    } else {
      aVal = aVal.toString().toLowerCase();
      bVal = bVal.toString().toLowerCase();
    }

    if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1;
    if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = sortedUsers.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(sortedUsers.length / itemsPerPage);

  // CRUD Modal Handlers
  const openCreateUserModal = () => {
    setCreateUserForm({
      name: '',
      email: '',
      role: 'student',
      password: '',
      confirmPassword: '',
    });
    setCreateUserModalOpen(true);
  };

  const closeCreateUserModal = () => {
    setCreateUserForm({
      name: '',
      email: '',
      role: 'student',
      password: '',
      confirmPassword: '',
    });
    setCreateUserModalOpen(false);
  };

  const openEditUserModal = (userToEdit) => {
    setEditingUser(userToEdit);
    setEditUserForm({
      name: userToEdit.name,
      email: userToEdit.email,
      role: userToEdit.role,
      password: '',
      confirmPassword: '',
      isBlocked: userToEdit.isBlocked || false,
    });
    setEditUserModalOpen(true);
  };

  const closeEditUserModal = () => {
    setEditingUser(null);
    setEditUserForm({
      name: '',
      email: '',
      role: 'student',
      password: '',
      confirmPassword: '',
      isBlocked: false,
    });
    setEditUserModalOpen(false);
  };

  const handleCreateUserSubmit = async (e) => {
    e.preventDefault();

    if (!createUserForm.name || !createUserForm.email || !createUserForm.role) {
      toast.error('Name, email, and role are required');
      return;
    }

    if (!createUserForm.password || !createUserForm.confirmPassword) {
      toast.error('Password and confirm password are required');
      return;
    }
    if (createUserForm.password !== createUserForm.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    if (createUserForm.password.length < 6) {
      toast.error('Password must be at least 6 characters long');
      return;
    }

    try {
      await API.post('/admin/users', {
        name: createUserForm.name,
        email: createUserForm.email,
        role: createUserForm.role,
        password: createUserForm.password,
        confirmPassword: createUserForm.confirmPassword,
      });
      toast.success('User created successfully');
      closeCreateUserModal();
      fetchDashboardData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error creating user');
    }
  };

  const handleEditUserSubmit = async (e) => {
    e.preventDefault();

    if (!editUserForm.name || !editUserForm.email || !editUserForm.role) {
      toast.error('Name, email, and role are required');
      return;
    }

    if (editUserForm.password && editUserForm.password !== editUserForm.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    if (editUserForm.password && editUserForm.password.length < 6) {
      toast.error('Password must be at least 6 characters long');
      return;
    }

    try {
      const payload = {
        name: editUserForm.name,
        email: editUserForm.email,
        role: editUserForm.role,
        isBlocked: editUserForm.isBlocked,
      };
      if (editUserForm.password) {
        payload.password = editUserForm.password;
      }
      await API.put(`/admin/users/${editingUser._id}`, payload);
      toast.success('User updated successfully');
      closeEditUserModal();
      fetchDashboardData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error updating user');
    }
  };

  // User Actions
  const handleToggleBlock = async (userId) => {
    try {
      const res = await API.patch(`/admin/users/${userId}/block`);
      toast.success(res.data.message);
      fetchDashboardData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error updating user block status');
    }
  };

  const handleDeleteUser = async (userId) => {
    if (userId === currentUser?._id) {
      toast.error('You cannot delete your own Administrator account');
      return;
    }
    if (!confirm('Are you sure you want to permanently delete this user account?')) return;
    try {
      await API.delete(`/admin/users/${userId}`);
      toast.success('User account deleted successfully');
      fetchDashboardData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error deleting user');
    }
  };

  // Multi-select Course Access Grant
  const handleGrantAccessSubmit = async (e) => {
    e.preventDefault();
    if (!grantCourseId) {
      toast.error('Please select a course');
      return;
    }
    if (selectedUserIdsForGrant.length === 0) {
      toast.error('Please select at least one student');
      return;
    }

    try {
      const res = await API.post('/enrollments', {
        courseId: grantCourseId,
        userIds: selectedUserIdsForGrant,
      });
      toast.success(res.data.message);
      setGrantModalOpen(false);
      setSelectedUserIdsForGrant([]);
      fetchDashboardData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error granting course access');
    }
  };

  // Category Actions
  const handleCategorySubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingCategory) {
        await API.put(`/categories/${editingCategory._id}`, { name: catName, description: catDesc });
        toast.success('Category updated successfully');
      } else {
        await API.post('/categories', { name: catName, description: catDesc });
        toast.success('Category created successfully');
      }
      setCategoryModalOpen(false);
      setCatName('');
      setCatDesc('');
      setEditingCategory(null);
      fetchDashboardData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error saving category');
    }
  };

  const handleDeleteCategory = async (catId) => {
    if (!confirm('Are you sure you want to delete this category?')) return;
    try {
      await API.delete(`/categories/${catId}`);
      toast.success('Category deleted');
      fetchDashboardData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error deleting category');
    }
  };

  // Course Actions
  // Course Actions
  // Course Actions
  const openCreateCourseModal = () => {
    setEditingCourse(null);
    setCourseForm({
      title: '',
      description: '',
      teachingMethodology: '',
      difficulty: 'Beginner',
      category: categories[0]?._id || '',
      accessType: 'PRIVATE',
      requirements: '',
      learningOutcomes: '',
      thumbnail: null,
      video: null,
    });
    setThumbnailFile(null);
    setVideoFile(null);
    setThumbnailPreview('');
    setThumbnailSuccess(false);
    setThumbnailInfo(null);
    setVideoInfo(null);
    setVideoSuccess(false);
    setThumbnailUploading(false);
    setVideoUploading(false);
    setThumbnailProgress(0);
    setVideoProgress(0);
    setCourseModalOpen(true);
  };

  const openEditCourseModal = (course) => {
    setEditingCourse(course);
    setCourseForm({
      title: course.title,
      description: course.description,
      teachingMethodology: course.teachingMethodology,
      difficulty: course.difficulty || 'Beginner',
      category: course.category?._id || course.category || '',
      accessType: course.accessType || 'PRIVATE',
      requirements: course.requirements?.join(', ') || '',
      learningOutcomes: course.learningOutcomes?.join(', ') || '',
      thumbnail: course.thumbnail || null,
      video: course.video || null,
    });
    setThumbnailFile(null);
    setVideoFile(null);
    setThumbnailPreview(course.thumbnail?.url || '');
    setThumbnailSuccess(!!course.thumbnail?.url);
    setThumbnailInfo(null);
    setVideoInfo(course.video?.url ? { name: 'Cloudinary Hosted Video', size: 'Cloudinary' } : null);
    setVideoSuccess(!!course.video?.url);
    setThumbnailUploading(false);
    setVideoUploading(false);
    setThumbnailProgress(0);
    setVideoProgress(0);
    setCourseModalOpen(true);
  };

  const handleThumbnailChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      toast.error('Unsupported file format. Please upload jpg, jpeg, png, or webp');
      return;
    }

    setThumbnailFile(file);
    setThumbnailInfo({ name: file.name, size: (file.size / (1024 * 1024)).toFixed(2) + ' MB' });
    setThumbnailPreview(URL.createObjectURL(file));
    setThumbnailSuccess(true);
  };

  const handleVideoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate type
    const allowedTypes = ['video/mp4', 'video/quicktime', 'video/webm', 'video/x-msvideo'];
    const fileExt = file.name.split('.').pop().toLowerCase();
    if (!allowedTypes.includes(file.type) && !['mp4', 'mov', 'webm', 'avi'].includes(fileExt)) {
      toast.error('Unsupported video format. Please upload mp4, mov, webm, or avi');
      return;
    }

    setVideoFile(file);
    setVideoInfo({ name: file.name, size: (file.size / (1024 * 1024)).toFixed(2) + ' MB' });
    setVideoSuccess(true);
  };

  const handleCourseSubmit = async (e) => {
    e.preventDefault();

    const finalThumbnail = editingCourse ? courseForm.thumbnail : null;
    const finalVideo = editingCourse ? courseForm.video : null;

    if (!thumbnailFile && (!finalThumbnail || !finalThumbnail.url)) {
      toast.error('Please select a Course Thumbnail.');
      return;
    }

    if (!videoFile && (!finalVideo || !finalVideo.url)) {
      toast.error('Please select a Lecture Video.');
      return;
    }

    setSubmittingCourse(true);

    try {
      const formData = new FormData();
      formData.append('title', courseForm.title);
      formData.append('description', courseForm.description);
      formData.append('teachingMethodology', courseForm.teachingMethodology);
      formData.append('difficulty', courseForm.difficulty);
      if (courseForm.category) {
        formData.append('category', courseForm.category);
      }
      formData.append('accessType', courseForm.accessType);
      
      const reqs = courseForm.requirements.split(',').map((s) => s.trim()).filter(Boolean);
      formData.append('requirements', JSON.stringify(reqs));

      const outs = courseForm.learningOutcomes.split(',').map((s) => s.trim()).filter(Boolean);
      formData.append('learningOutcomes', JSON.stringify(outs));

      if (thumbnailFile) {
        formData.append('thumbnail', thumbnailFile);
      } else if (finalThumbnail) {
        formData.append('thumbnail', JSON.stringify(finalThumbnail));
      }

      if (videoFile) {
        formData.append('video', videoFile);
      } else if (finalVideo) {
        formData.append('video', JSON.stringify(finalVideo));
      }

      const config = {
        headers: { 'Content-Type': 'multipart/form-data' }
      };

      if (editingCourse) {
        await API.put(`/courses/${editingCourse._id}`, formData, config);
        toast.success('Course updated successfully');
      } else {
        await API.post('/courses', formData, config);
        toast.success('Course published successfully!');
      }

      setCourseModalOpen(false);
      fetchDashboardData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error saving course');
    } finally {
      setSubmittingCourse(false);
    }
  };

  const handleDeleteCourse = async (courseId) => {
    if (!confirm('Are you sure you want to delete this course? Associated access records will be removed.')) return;
    try {
      await API.delete(`/courses/${courseId}`);
      toast.success('Course deleted');
      fetchDashboardData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error deleting course');
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center text-sm font-medium text-slate-500">
        Loading Administrator Control Console...
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#1E293B] pb-6">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-950/80 border border-blue-500/30 text-[#60A5FA] text-xs font-semibold uppercase mb-2">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Administrator Control Console</span>
          </div>
          <h1 className="text-3xl font-extrabold text-[#F8FAFC]">Platform Command Center</h1>
        </div>

        <div className="flex flex-wrap gap-3">
          <Button variant="primary" size="sm" onClick={openCreateCourseModal} className="space-x-1.5">
            <Plus className="w-4 h-4" />
            <span>Create Course</span>
          </Button>

          <Button
            variant="accent"
            size="sm"
            onClick={() => {
              if (courses.length > 0) setGrantCourseId(courses[0]._id);
              setGrantModalOpen(true);
            }}
            className="space-x-1.5"
          >
            <UserCheck className="w-4 h-4" />
            <span>Grant Multi Access</span>
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setEditingCategory(null);
              setCatName('');
              setCatDesc('');
              setCategoryModalOpen(true);
            }}
            className="space-x-1.5"
          >
            <Layers className="w-4 h-4" />
            <span>+ Category</span>
          </Button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-[#1E293B] space-x-8 overflow-x-auto">
        {[
          { key: 'overview', label: 'Overview & Stats', icon: BarChart2 },
          { key: 'users', label: 'User Management', icon: Users },
          { key: 'courses', label: 'Course Management', icon: BookOpen },
          { key: 'categories', label: 'Categories', icon: Layers },
          { key: 'analytics', label: 'Visitor Analytics', icon: Activity },
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`p-3 text-sm font-semibold flex items-center space-x-2 border-b-2 transition-all cursor-pointer whitespace-nowrap ${activeTab === tab.key
                  ? 'border-[#2563EB] text-[#60A5FA]'
                  : 'border-transparent text-slate-400 hover:bg-[#2563EB] hover:text-[#F8FAFC]'
                }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: OVERVIEW */}
      {activeTab === 'overview' && (
        <div className="space-y-8 animate-fade-in">
          {/* Key Metrics Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            <Card hover className="space-y-2">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-400 uppercase tracking-wider">
                <span>Total Users</span>
                <Users className="w-4 h-4 text-[#60A5FA]" />
              </div>
              <div className="text-3xl font-extrabold text-[#F8FAFC]">{stats.totalUsers}</div>
              <p className="text-xs text-slate-400">{stats.totalStudents} Students · {stats.totalAdmins} Admins</p>
            </Card>

            <Card hover className="space-y-2">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-400 uppercase tracking-wider">
                <span>Courses</span>
                <BookOpen className="w-4 h-4 text-[#22D3EE]" />
              </div>
              <div className="text-3xl font-extrabold text-[#F8FAFC]">{stats.totalCourses}</div>
              <p className="text-xs text-slate-400">{stats.totalCategories} Categories</p>
            </Card>

            <Card hover className="space-y-2">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-400 uppercase tracking-wider">
                <span>Today's Visitors</span>
                <Activity className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="text-3xl font-extrabold text-[#F8FAFC]">{stats.todayVisitors}</div>
              <p className="text-xs text-slate-400">{stats.weeklyVisitors} Weekly · {stats.totalVisitors} Total</p>
            </Card>

            <Card hover className="space-y-2">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-400 uppercase tracking-wider">
                <span>Monthly Visits</span>
                <Calendar className="w-4 h-4 text-amber-400" />
              </div>
              <div className="text-3xl font-extrabold text-[#F8FAFC]">{stats.monthlyVisitors}</div>
              <p className="text-xs text-slate-400">Live Traffic Logs</p>
            </Card>
          </div>

          {/* Recent Registrations Table */}
          <Card className="space-y-4">
            <h3 className="text-base font-bold text-[#F8FAFC]">Recent User Registrations</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-300">
                <thead className="bg-[#0F172A] text-xs uppercase font-bold text-slate-400 border-b border-[#1E293B]">
                  <tr>
                    <th className="px-4 py-3">User</th>
                    <th className="px-4 py-3">Role</th>
                    <th className="px-4 py-3">Joined Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1E293B]">
                  {stats.recentUsers.map((u) => (
                    <tr key={u._id} className="hover:bg-[#1E293B]/50 transition-colors">
                      <td className="px-4 py-3 font-semibold text-[#F8FAFC] flex items-center space-x-2">
                        <img
                          src={u.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${u.name}`}
                          alt={u.name}
                          className="w-6 h-6 rounded-full"
                        />
                        <span>{u.name} ({u.email})</span>
                      </td>
                      <td className="px-4 py-3">
                        <Badge variant={u.role === 'admin' ? 'secondary' : 'primary'}>{u.role}</Badge>
                      </td>
                      <td className="px-4 py-3 text-xs text-slate-400">
                        {new Date(u.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      )}

      {/* TAB 2: USER MANAGEMENT */}
      {activeTab === 'users' && (
        <div className="space-y-6 animate-fade-in">
          {/* Controls Bar */}
          <div className="bg-[#111827] p-4 rounded-2xl border border-[#1E293B] shadow-xl flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="w-full md:w-72">
              <Input
                placeholder="Search user name or email..."
                value={userSearch}
                onChange={(e) => setUserSearch(e.target.value)}
              />
            </div>

            <div className="flex flex-wrap gap-3 w-full md:w-auto items-center justify-end">
              <div className="w-36">
                <Select
                  value={userRoleFilter}
                  onChange={(e) => setUserRoleFilter(e.target.value)}
                  options={[
                    { label: 'All Roles', value: 'all' },
                    { label: 'Student', value: 'student' },
                    { label: 'Admin', value: 'admin' },
                  ]}
                />
              </div>

              <div className="w-36">
                <Select
                  value={userStatusFilter}
                  onChange={(e) => setUserStatusFilter(e.target.value)}
                  options={[
                    { label: 'All Statuses', value: 'all' },
                    { label: 'Active', value: 'active' },
                    { label: 'Blocked', value: 'blocked' },
                  ]}
                />
              </div>

              <Button
                variant="primary"
                size="sm"
                onClick={openCreateUserModal}
                className="space-x-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>Create User</span>
              </Button>
            </div>
          </div>

          {/* User Table */}
          <Card className="!p-0 overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-300 border-collapse">
              <thead className="bg-[#0F172A] text-xs uppercase font-bold text-slate-400 border-b border-[#1E293B]">
                <tr>
                  <th className="px-6 py-4 cursor-pointer select-none hover:text-[#60A5FA]" onClick={() => handleSort('name')}>
                    User {sortField === 'name' ? (sortDirection === 'asc' ? ' ▲' : ' ▼') : ''}
                  </th>
                  <th className="px-6 py-4 cursor-pointer select-none hover:text-[#60A5FA]" onClick={() => handleSort('role')}>
                    Role {sortField === 'role' ? (sortDirection === 'asc' ? ' ▲' : ' ▼') : ''}
                  </th>
                  <th className="px-6 py-4">Status & Online</th>
                  <th className="px-6 py-4">Granted Courses</th>
                  <th className="px-6 py-4 cursor-pointer select-none hover:text-[#60A5FA]" onClick={() => handleSort('createdAt')}>
                    Created Date {sortField === 'createdAt' ? (sortDirection === 'asc' ? ' ▲' : ' ▼') : ''}
                  </th>
                  <th className="px-6 py-4 cursor-pointer select-none hover:text-[#60A5FA]" onClick={() => handleSort('lastLogin')}>
                    Last Login {sortField === 'lastLogin' ? (sortDirection === 'asc' ? ' ▲' : ' ▼') : ''}
                  </th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1E293B]">
                {currentItems.map((user) => (
                  <tr key={user._id} className="hover:bg-[#1E293B]/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <img
                          src={user.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`}
                          alt={user.name}
                          className="w-9 h-9 rounded-full bg-[#0F172A] border border-[#1E293B]"
                        />
                        <div>
                          <div className="font-bold text-[#F8FAFC]">{user.name}</div>
                          <div className="text-xs text-slate-400">{user.email}</div>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <Badge variant={user.role === 'admin' ? 'secondary' : 'primary'}>
                        {user.role}
                      </Badge>
                    </td>

                    {/* Online Status & Block Status */}
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        {user.isOnline ? (
                          <span className="inline-flex items-center text-xs font-semibold text-emerald-400">
                            <span className="w-2 h-2 rounded-full bg-emerald-500 mr-1.5 animate-pulse"></span>
                            Online
                          </span>
                        ) : (
                          <span className="inline-flex items-center text-xs font-medium text-slate-400">
                            <span className="w-2 h-2 rounded-full bg-slate-500 mr-1.5"></span>
                            Offline
                          </span>
                        )}

                        {user.isBlocked && (
                          <Badge variant="danger" className="text-[10px]">
                            BLOCKED
                          </Badge>
                        )}
                      </div>
                    </td>

                    {/* Granted Courses */}
                    <td className="px-6 py-4">
                      {user.enrollments && user.enrollments.length > 0 ? (
                        <div className="flex flex-wrap gap-1">
                          {user.enrollments.map((e) => (
                            <span
                              key={e._id}
                              className="px-2 py-0.5 rounded-md bg-blue-950/80 text-[#60A5FA] text-xs border border-blue-500/30"
                            >
                              {e.courseId?.title || 'Course'}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <span className="text-xs text-slate-400 italic">No grants</span>
                      )}
                    </td>

                    {/* Created Date */}
                    <td className="px-6 py-4 text-xs text-slate-400">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>

                    {/* Last Login */}
                    <td className="px-6 py-4 text-xs text-slate-400">
                      {user.lastLogin ? new Date(user.lastLogin).toLocaleString() : 'Never'}
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4 text-right space-x-2">
                      <button
                        onClick={() => setSelectedUserDetail(user)}
                        className="p-1.5 text-slate-400 hover:text-blue-400 rounded-lg hover:bg-[#1E293B] transition-colors"
                        title="View Details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => openEditUserModal(user)}
                        className="p-1.5 text-slate-400 hover:text-[#2563EB] rounded-lg hover:bg-[#1E293B] transition-colors"
                        title="Edit User"
                      >
                        <Edit className="w-4 h-4" />
                      </button>

                      {user._id !== currentUser?._id && (
                        <>
                          <button
                            onClick={() => handleToggleBlock(user._id)}
                            className={`p-1.5 rounded-lg transition-colors ${user.isBlocked
                                ? 'text-emerald-400 hover:bg-emerald-950/50'
                                : 'text-amber-400 hover:bg-amber-950/50'
                              }`}
                            title={user.isBlocked ? 'Unblock User' : 'Block User'}
                          >
                            {user.isBlocked ? <Unlock className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
                          </button>

                          <button
                            onClick={() => handleDeleteUser(user._id)}
                            className="p-1.5 text-slate-400 hover:text-red-400 rounded-lg hover:bg-red-950/50 transition-colors"
                            title="Delete User"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between bg-[#111827] px-4 py-3 sm:px-6 rounded-2xl border border-[#1E293B]">
              <div className="flex flex-1 justify-between sm:hidden">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(currentPage - 1)}
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(currentPage + 1)}
                >
                  Next
                </Button>
              </div>
              <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                <div>
                  <p className="text-xs text-slate-400">
                    Showing <span className="font-semibold text-slate-200">{indexOfFirstItem + 1}</span> to{' '}
                    <span className="font-semibold text-slate-200">
                      {Math.min(indexOfLastItem, sortedUsers.length)}
                    </span>{' '}
                    of <span className="font-semibold text-slate-200">{sortedUsers.length}</span> users
                  </p>
                </div>
                <div className="flex space-x-1">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(1)}
                  >
                    « First
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(currentPage - 1)}
                  >
                    ‹ Prev
                  </Button>
                  <span className="px-4 py-2 text-xs font-semibold text-slate-200 bg-[#0F172A] border border-[#1E293B] rounded-xl flex items-center">
                    Page {currentPage} of {totalPages}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage(currentPage + 1)}
                  >
                    Next ›
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage(totalPages)}
                  >
                    Last »
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 3: COURSE MANAGEMENT */}
      {activeTab === 'courses' && (
        <div className="space-y-6 animate-fade-in">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-[#F8FAFC]">Published Platform Courses</h3>
            <Button variant="primary" size="sm" onClick={openCreateCourseModal} className="space-x-1.5">
              <Plus className="w-4 h-4" />
              <span>Create New Course</span>
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => (
              <Card key={course._id} className="flex flex-col justify-between space-y-4 !p-0 overflow-hidden">
                <div className="space-y-3">
                  <div className="aspect-video relative overflow-hidden bg-[#0F172A] border-b border-[#1E293B]">
                    <img
                      src={course.thumbnail?.url || ''}
                      alt={course.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2 left-2 flex gap-1">
                      <Badge variant={course.accessType === 'PUBLIC' ? 'success' : 'secondary'}>
                        {course.accessType}
                      </Badge>
                    </div>
                  </div>

                  <div className="px-5 space-y-2">
                    <h4 className="font-bold text-base text-[#F8FAFC]">{course.title}</h4>
                    <p className="text-xs text-slate-300 line-clamp-2">{course.description}</p>
                  </div>
                </div>

                <div className="px-5 pb-5 pt-2 flex items-center justify-between border-t border-[#1E293B]">
                  <span className="text-xs text-slate-400 font-medium">
                    {course.category?.name || 'Uncategorized'}
                  </span>
                  <div className="space-x-2">
                    <Button variant="outline" size="sm" onClick={() => openEditCourseModal(course)}>
                      <Edit className="w-3.5 h-3.5" />
                    </Button>
                    <Button variant="danger" size="sm" onClick={() => handleDeleteCourse(course._id)}>
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: CATEGORY MANAGEMENT */}
      {activeTab === 'categories' && (
        <div className="space-y-6 animate-fade-in">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-[#F8FAFC]">Course Categories</h3>
            <Button
              variant="primary"
              size="sm"
              onClick={() => {
                setEditingCategory(null);
                setCatName('');
                setCatDesc('');
                setCategoryModalOpen(true);
              }}
              className="space-x-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Add Category</span>
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {categories.map((cat) => (
              <Card key={cat._id} className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2.5">
                    <div className="p-2 rounded-xl bg-blue-950/80 text-[#60A5FA] border border-blue-500/30">
                      <Layers className="w-5 h-5" />
                    </div>
                    <h4 className="font-bold text-[#F8FAFC]">{cat.name}</h4>
                  </div>
                  <Badge variant="primary">{cat.courseCount || 0} Courses</Badge>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">{cat.description || 'No description provided.'}</p>

                <div className="flex justify-end space-x-2 pt-2 border-t border-[#1E293B]">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setEditingCategory(cat);
                      setCatName(cat.name);
                      setCatDesc(cat.description || '');
                      setCategoryModalOpen(true);
                    }}
                  >
                    Edit
                  </Button>
                  <Button variant="danger" size="sm" onClick={() => handleDeleteCategory(cat._id)}>
                    Delete
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* TAB 5: VISITOR ANALYTICS */}
      {activeTab === 'analytics' && (
        <div className="space-y-8 animate-fade-in">
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-[#F8FAFC]">Visitor Traffic Analytics</h3>
            <p className="text-xs text-slate-400">Live aggregated logs across daily, weekly, and monthly intervals.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Daily Chart */}
            <Card className="space-y-4">
              <h4 className="text-sm font-bold text-slate-200 uppercase tracking-wider">Daily Visitors (Last 7 Days)</h4>
              <div className="h-48 flex items-end justify-between gap-2 pt-6">
                {visitorAnalytics.daily.map((item, idx) => (
                  <div key={idx} className="flex-1 flex flex-col items-center gap-2">
                    <span className="text-[10px] font-bold text-slate-300">{item.count}</span>
                    <div
                      className="w-full bg-[#2563EB] rounded-t-lg transition-all"
                      style={{ height: `${Math.max(10, item.count * 15)}px` }}
                    ></div>
                    <span className="text-[10px] text-slate-400">{item.label}</span>
                  </div>
                ))}
              </div>
            </Card>

            {/* Monthly Chart */}
            <Card className="space-y-4">
              <h4 className="text-sm font-bold text-slate-200 uppercase tracking-wider">Monthly Traffic Trends</h4>
              <div className="h-48 flex items-end justify-between gap-2 pt-6">
                {visitorAnalytics.monthly.map((item, idx) => (
                  <div key={idx} className="flex-1 flex flex-col items-center gap-2">
                    <span className="text-[10px] font-bold text-slate-300">{item.count}</span>
                    <div
                      className="w-full bg-[#14B8A6] rounded-t-lg transition-all"
                      style={{ height: `${Math.max(10, item.count * 10)}px` }}
                    ></div>
                    <span className="text-[10px] text-slate-400">{item.label}</span>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      )}

      {/* MODAL: CREATE / EDIT COURSE */}
      <Modal
        isOpen={courseModalOpen}
        onClose={() => setCourseModalOpen(false)}
        title={editingCourse ? 'Edit Course' : 'Create New Course'}
      >
        <form onSubmit={handleCourseSubmit} className="space-y-4 text-left">
          <Input
            label="Course Title"
            required
            value={courseForm.title}
            onChange={(e) => setCourseForm({ ...courseForm, title: e.target.value })}
            placeholder="e.g. Master React & Node.js Microservices"
          />

          <Textarea
            label="Description"
            rows={3}
            value={courseForm.description}
            onChange={(e) => setCourseForm({ ...courseForm, description: e.target.value })}
          />

          <Textarea
            label="Teaching Methodology"
            required
            rows={2}
            value={courseForm.teachingMethodology}
            onChange={(e) => setCourseForm({ ...courseForm, teachingMethodology: e.target.value })}
          />

          <div className="grid grid-cols-2 gap-4">
            <Select
              label="Access Type"
              value={courseForm.accessType}
              onChange={(e) => setCourseForm({ ...courseForm, accessType: e.target.value })}
              options={[
                { label: 'PRIVATE (Admin Grant Required)', value: 'PRIVATE' },
                { label: 'PUBLIC (Accessible to All Students)', value: 'PUBLIC' },
              ]}
            />

            <Select
              label="Difficulty"
              value={courseForm.difficulty}
              onChange={(e) => setCourseForm({ ...courseForm, difficulty: e.target.value })}
              options={[
                { label: 'Beginner', value: 'Beginner' },
                { label: 'Intermediate', value: 'Intermediate' },
                { label: 'Advanced', value: 'Advanced' },
              ]}
            />
          </div>

          <Select
            label="Category"
            value={courseForm.category}
            onChange={(e) => setCourseForm({ ...courseForm, category: e.target.value })}
            options={[
              { label: '-- Select Category --', value: '' },
              ...categories.map((c) => ({ label: c.name, value: c._id })),
            ]}
          />

          {/* Media Upload Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-[#1E293B]">
            {/* Thumbnail Upload component */}
            <div className="space-y-2 text-left">
              <label className="text-xs font-semibold text-slate-300">Course Thumbnail</label>

              <div className="border-2 border-dashed border-[#334155] hover:border-slate-500 rounded-lg p-4 text-center transition relative overflow-hidden bg-[#0F172A]/50">
                {thumbnailPreview ? (
                  <div className="space-y-2">
                    <img
                      src={thumbnailPreview}
                      alt="Thumbnail Preview"
                      className="mx-auto max-h-32 object-cover rounded shadow-md"
                    />
                    <div className="text-xs text-slate-400 truncate">
                      {thumbnailInfo ? `${thumbnailInfo.name} (${thumbnailInfo.size})` : 'Current Thumbnail'}
                    </div>
                    {thumbnailSuccess && (
                      <span className="inline-flex items-center text-emerald-400 text-xs font-medium bg-emerald-500/10 px-2 py-0.5 rounded">
                        <CheckCircle2 size={12} className="mr-1" /> Upload Success
                      </span>
                    )}
                  </div>
                ) : (
                  <div className="py-4">
                    <BookOpen className="mx-auto text-slate-500 mb-2" size={28} />
                    <p className="text-xs text-slate-400">Click to select Thumbnail image</p>
                    <p className="text-[10px] text-slate-500 mt-1">Accepted: jpg, jpeg, png, webp</p>
                  </div>
                )}

                <input
                  type="file"
                  accept=".jpg,.jpeg,.png,.webp"
                  onChange={handleThumbnailChange}
                  disabled={thumbnailUploading}
                  className="absolute inset-0 opacity-0 cursor-pointer disabled:cursor-not-allowed"
                />
              </div>

              {thumbnailUploading && (
                <div className="space-y-1">
                  <div className="flex justify-between text-[10px] font-semibold text-slate-400">
                    <span>Uploading...</span>
                    <span>{thumbnailProgress}%</span>
                  </div>
                  <div className="w-full bg-[#1E293B] rounded-full h-1.5 overflow-hidden">
                    <div
                      className="bg-sky-500 h-full rounded-full transition-all duration-300"
                      style={{ width: `${thumbnailProgress}%` }}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Video Upload component */}
            <div className="space-y-2 text-left">
              <label className="text-xs font-semibold text-slate-300">Course Lecture Video</label>

              <div className="border-2 border-dashed border-[#334155] hover:border-slate-500 rounded-lg p-4 text-center transition relative overflow-hidden bg-[#0F172A]/50">
                {videoInfo ? (
                  <div className="py-4 space-y-2">
                    <div className="w-12 h-12 rounded-full bg-sky-500/10 flex items-center justify-center mx-auto text-sky-400">
                      <Activity size={24} />
                    </div>
                    <div className="text-xs font-medium text-slate-300 truncate">
                      {videoInfo.name}
                    </div>
                    <div className="text-[10px] text-slate-500">
                      Size: {videoInfo.size}
                    </div>
                    {videoSuccess && (
                      <span className="inline-flex items-center text-emerald-400 text-xs font-medium bg-emerald-500/10 px-2 py-0.5 rounded">
                        <CheckCircle2 size={12} className="mr-1" /> Video Selected / Uploaded
                      </span>
                    )}
                  </div>
                ) : (
                  <div className="py-4">
                    <Activity className="mx-auto text-slate-500 mb-2" size={28} />
                    <p className="text-xs text-slate-400">Click to select Lecture video</p>
                    <p className="text-[10px] text-slate-500 mt-1">Accepted: mp4, mov, webm, avi</p>
                  </div>
                )}

                <input
                  type="file"
                  accept=".mp4,.mov,.webm,.avi"
                  onChange={handleVideoChange}
                  disabled={videoUploading}
                  className="absolute inset-0 opacity-0 cursor-pointer disabled:cursor-not-allowed"
                />
              </div>

              {videoUploading && (
                <div className="space-y-1">
                  <div className="flex justify-between text-[10px] font-semibold text-slate-400">
                    <span>Uploading...</span>
                    <span>{videoProgress}%</span>
                  </div>
                  <div className="w-full bg-[#1E293B] rounded-full h-1.5 overflow-hidden">
                    <div
                      className="bg-sky-500 h-full rounded-full transition-all duration-300"
                      style={{ width: `${videoProgress}%` }}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          <Button
            variant="primary"
            size="lg"
            disabled={submittingCourse || thumbnailUploading || videoUploading}
            type="submit"
            className="w-full"
          >
            {submittingCourse
              ? 'Saving Course...'
              : thumbnailUploading || videoUploading
                ? 'Uploading Media...'
                : editingCourse
                  ? 'Update Course'
                  : 'Publish Course'}
          </Button>
        </form>
      </Modal>

      {/* MODAL: MULTI-SELECT COURSE ACCESS GRANT */}
      <Modal
        isOpen={grantModalOpen}
        onClose={() => setGrantModalOpen(false)}
        title="Grant Private Course Access"
      >
        <form onSubmit={handleGrantAccessSubmit} className="space-y-4 text-left">
          <Select
            label="Select Private Course"
            value={grantCourseId}
            onChange={(e) => setGrantCourseId(e.target.value)}
            options={courses.map((c) => ({ label: `${c.title} (${c.accessType})`, value: c._id }))}
          />

          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-300">Select Students (Multi-Select Allowed)</label>
            <div className="max-h-48 overflow-y-auto border border-[#1E293B] rounded-xl p-3 space-y-2 bg-[#0F172A]">
              {users
                .filter((u) => u.role === 'student')
                .map((u) => {
                  const checked = selectedUserIdsForGrant.includes(u._id);
                  return (
                    <label
                      key={u._id}
                      className="flex items-center space-x-2 text-xs font-medium text-slate-200 cursor-pointer p-1 rounded hover:bg-[#1E293B]"
                    >
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedUserIdsForGrant([...selectedUserIdsForGrant, u._id]);
                          } else {
                            setSelectedUserIdsForGrant(selectedUserIdsForGrant.filter((id) => id !== u._id));
                          }
                        }}
                      />
                      <span>{u.name} ({u.email})</span>
                    </label>
                  );
                })}
            </div>
          </div>

          <Button variant="primary" size="lg" type="submit" className="w-full">
            Grant Selected Course Access
          </Button>
        </form>
      </Modal>

      {/* MODAL: CREATE / EDIT CATEGORY */}
      <Modal
        isOpen={categoryModalOpen}
        onClose={() => setCategoryModalOpen(false)}
        title={editingCategory ? 'Edit Category' : 'Create Category'}
      >
        <form onSubmit={handleCategorySubmit} className="space-y-4 text-left">
          <Input
            label="Category Name"
            required
            value={catName}
            onChange={(e) => setCatName(e.target.value)}
            placeholder="e.g. Frontend Development"
          />

          <Textarea
            label="Description"
            rows={3}
            value={catDesc}
            onChange={(e) => setCatDesc(e.target.value)}
          />

          <Button variant="primary" size="lg" type="submit" className="w-full">
            Save Category
          </Button>
        </form>
      </Modal>

      {/* MODAL: CREATE USER */}
      <Modal
        isOpen={createUserModalOpen}
        onClose={closeCreateUserModal}
        title="Create New User Account"
      >
        <form onSubmit={handleCreateUserSubmit} className="space-y-4 text-left">
          <Input
            label="Full Name"
            required
            value={createUserForm.name}
            onChange={(e) => setCreateUserForm({ ...createUserForm, name: e.target.value })}
            placeholder="e.g. John Doe"
            autoComplete="off"
          />

          <Input
            label="Email Address"
            required
            type="email"
            value={createUserForm.email}
            onChange={(e) => setCreateUserForm({ ...createUserForm, email: e.target.value })}
            placeholder="e.g. john.doe@example.com"
            autoComplete="off"
          />

          <Select
            label="Account Role"
            value={createUserForm.role}
            onChange={(e) => setCreateUserForm({ ...createUserForm, role: e.target.value })}
            options={[
              { label: 'Student', value: 'student' },
              { label: 'Admin', value: 'admin' },
            ]}
          />

          <div className="border-t border-[#1E293B] pt-4 space-y-4">
            <h4 className="text-xs font-bold text-[#F8FAFC]">Set Password</h4>

            <Input
              label="Password"
              type="password"
              required
              value={createUserForm.password}
              onChange={(e) => setCreateUserForm({ ...createUserForm, password: e.target.value })}
              placeholder="At least 6 characters"
              autoComplete="new-password"
            />

            <Input
              label="Confirm Password"
              type="password"
              required
              value={createUserForm.confirmPassword}
              onChange={(e) => setCreateUserForm({ ...createUserForm, confirmPassword: e.target.value })}
              placeholder="Must match password"
              autoComplete="new-password"
            />
          </div>

          <Button variant="primary" size="lg" type="submit" className="w-full mt-4">
            Create User Account
          </Button>
        </form>
      </Modal>

      {/* MODAL: EDIT USER */}
      <Modal
        isOpen={editUserModalOpen}
        onClose={closeEditUserModal}
        title="Edit User Account"
      >
        <form onSubmit={handleEditUserSubmit} className="space-y-4 text-left">
          <Input
            label="Full Name"
            required
            value={editUserForm.name}
            onChange={(e) => setEditUserForm({ ...editUserForm, name: e.target.value })}
            placeholder="e.g. John Doe"
            autoComplete="off"
          />

          <Input
            label="Email Address"
            required
            type="email"
            value={editUserForm.email}
            onChange={(e) => setEditUserForm({ ...editUserForm, email: e.target.value })}
            placeholder="e.g. john.doe@example.com"
            autoComplete="off"
          />

          <Select
            label="Account Role"
            value={editUserForm.role}
            onChange={(e) => setEditUserForm({ ...editUserForm, role: e.target.value })}
            options={[
              { label: 'Student', value: 'student' },
              { label: 'Admin', value: 'admin' },
            ]}
          />

          <div className="flex items-center space-x-2 pt-2 pb-1">
            <input
              type="checkbox"
              id="editIsBlockedCheckbox"
              checked={editUserForm.isBlocked}
              disabled={editingUser?._id === currentUser?._id}
              onChange={(e) => setEditUserForm({ ...editUserForm, isBlocked: e.target.checked })}
              className="rounded text-blue-500 focus:ring-blue-500 bg-[#0F172A] border-[#1E293B]"
            />
            <label htmlFor="editIsBlockedCheckbox" className="text-xs font-semibold text-[#94A3B8] cursor-pointer">
              Suspend Account (Block Access)
            </label>
          </div>

          <div className="border-t border-[#1E293B] pt-4 space-y-4">
            <h4 className="text-xs font-bold text-[#F8FAFC]">Change Password (Optional)</h4>

            <Input
              label="Password"
              type="password"
              value={editUserForm.password}
              onChange={(e) => setEditUserForm({ ...editUserForm, password: e.target.value })}
              placeholder="Leave blank to keep current password"
              autoComplete="new-password"
            />

            <Input
              label="Confirm Password"
              type="password"
              value={editUserForm.confirmPassword}
              onChange={(e) => setEditUserForm({ ...editUserForm, confirmPassword: e.target.value })}
              placeholder="Leave blank to keep current password"
              autoComplete="new-password"
            />
          </div>

          <Button variant="primary" size="lg" type="submit" className="w-full mt-4">
            Update User Account
          </Button>
        </form>
      </Modal>

      {/* MODAL: USER DETAILS */}
      <Modal
        isOpen={Boolean(selectedUserDetail)}
        onClose={() => setSelectedUserDetail(null)}
        title="User Profile Details"
      >
        {selectedUserDetail && (
          <div className="space-y-4 text-sm text-slate-300">
            <div className="flex items-center space-x-3 border-b border-[#1E293B] pb-3">
              <img
                src={selectedUserDetail.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${selectedUserDetail.name}`}
                alt={selectedUserDetail.name}
                className="w-12 h-12 rounded-full border border-[#1E293B]"
              />
              <div>
                <h4 className="font-bold text-[#F8FAFC] text-base">{selectedUserDetail.name}</h4>
                <p className="text-xs text-slate-400">{selectedUserDetail.email}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs">
              <div>
                <span className="font-bold text-[#F8FAFC] block mb-1">Role:</span>
                <Badge variant={selectedUserDetail.role === 'admin' ? 'secondary' : 'primary'}>
                  {selectedUserDetail.role}
                </Badge>
              </div>

              <div>
                <span className="font-bold text-[#F8FAFC] block mb-1">Status:</span>
                {selectedUserDetail.isBlocked ? (
                  <Badge variant="danger">Blocked</Badge>
                ) : (
                  <Badge variant="success">Active</Badge>
                )}
              </div>

              <div>
                <span className="font-bold text-[#F8FAFC] block">Created At:</span>
                <span className="text-slate-400">{new Date(selectedUserDetail.createdAt).toLocaleString()}</span>
              </div>

              <div>
                <span className="font-bold text-[#F8FAFC] block">Last Active:</span>
                <span className="text-slate-400">
                  {selectedUserDetail.lastActive
                    ? new Date(selectedUserDetail.lastActive).toLocaleString()
                    : 'N/A'}
                </span>
              </div>
            </div>

            <div className="border-t border-[#1E293B] pt-3 space-y-2">
              <h5 className="font-bold text-[#F8FAFC] text-xs">Granted Course Enrollments</h5>
              {selectedUserDetail.enrollments && selectedUserDetail.enrollments.length > 0 ? (
                <ul className="space-y-1 text-xs">
                  {selectedUserDetail.enrollments.map((e) => (
                    <li key={e._id} className="p-2 rounded bg-[#0F172A] border border-[#1E293B] text-slate-200">
                      {e.courseId?.title || 'Course'}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-xs text-slate-400 italic">No course access granted</p>
              )}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
