import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import API from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Button, Card, Badge, Input, Select } from '../components/UI';
import { Search, BookOpen, Lock, PlayCircle, CheckCircle, Globe } from 'lucide-react';
import toast from 'react-hot-toast';

export const Catalog = () => {
  const [searchParams] = useSearchParams();
  const [courses, setCourses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [myCourseIds, setMyCourseIds] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || '');
  const [selectedDifficulty, setSelectedDifficulty] = useState('');

  const { user } = useAuth();

  const fetchCatalog = async () => {
    setLoading(true);
    try {
      const params = {};
      if (searchTerm) params.search = searchTerm;
      if (selectedCategory) params.category = selectedCategory;
      if (selectedDifficulty) params.difficulty = selectedDifficulty;

      const [res, catRes] = await Promise.all([
        API.get('/courses', { params }),
        API.get('/categories'),
      ]);

      setCourses(res.data);
      setCategories(catRes.data);

      if (user) {
        try {
          const myCoursesRes = await API.get('/courses/my-courses');
          setMyCourseIds(myCoursesRes.data.map((c) => c._id));
        } catch (e) {}
      }
    } catch (err) {
      toast.error('Failed to load course catalog.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCatalog();
  }, [selectedCategory, selectedDifficulty, user]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchCatalog();
  };

  const handleRequestAccess = (courseTitle) => {
    toast.success(`Access request sent for "${courseTitle}". Contact an administrator for approval.`, {
      duration: 4000,
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10 bg-[#020617] text-[#F8FAFC]">
      {/* Catalog Header */}
      <div className="space-y-4">
        <Badge variant="accent">Course Catalog</Badge>
        <h1 className="text-3xl font-extrabold text-[#F8FAFC]">Baccalaureate CS Modules</h1>
        <p className="text-[#94A3B8] text-sm max-w-2xl">
          Public courses are accessible immediately to all registered students. Private modules require an administrator access grant.
        </p>

        {/* Filter Controls */}
        <div className="bg-[#0F172A] p-4 rounded-2xl border border-[#1E293B] shadow-lg flex flex-col md:flex-row gap-4 items-center">
          <form onSubmit={handleSearchSubmit} className="flex-1 w-full">
            <Input
              placeholder="Search courses by keyword..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </form>

          <div className="w-full md:w-48">
            <Select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              options={[
                { label: 'All Categories', value: '' },
                ...categories.map((c) => ({ label: c.name, value: c._id })),
              ]}
            />
          </div>

          <div className="w-full md:w-48">
            <Select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
              options={[
                { label: 'All Difficulties', value: '' },
                { label: 'Beginner', value: 'Beginner' },
                { label: 'Intermediate', value: 'Intermediate' },
                { label: 'Advanced', value: 'Advanced' },
              ]}
            />
          </div>
        </div>
      </div>

      {/* Courses Grid */}
      {loading ? (
        <div className="py-20 text-center text-sm font-medium text-[#94A3B8]">
          Loading Course Catalog...
        </div>
      ) : courses.length === 0 ? (
        <Card className="p-12 text-center space-y-3 border-[#1E293B]">
          <BookOpen className="w-12 h-12 text-[#94A3B8] mx-auto" />
          <h3 className="text-lg font-bold text-[#F8FAFC]">No Courses Match Your Criteria</h3>
          <p className="text-sm text-[#94A3B8]">Try adjusting your category filter or search keywords.</p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {courses.map((course) => {
            const isEnrolled = myCourseIds.includes(course._id);
            const isPublic = course.accessType === 'PUBLIC';
            const canWatch = isPublic || isEnrolled;

            return (
              <Card key={course._id} hover className="flex flex-col justify-between space-y-6 !p-0 overflow-hidden border-[#1E293B]">
                <div className="space-y-4">
                  {/* Thumbnail Container */}
                  <div className="aspect-video relative overflow-hidden bg-[#0F172A] border-b border-[#1E293B]">
                    <img
                      src={course.thumbnail?.url || 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800'}
                      alt={course.title}
                      className="w-full h-full object-cover"
                    />

                    {/* Access Type Badges */}
                    <div className="absolute top-3 left-3 flex gap-2">
                      {isPublic ? (
                        <span className="px-2.5 py-1 rounded-full bg-emerald-500/90 text-white text-[10px] font-bold flex items-center space-x-1 shadow-md">
                          <Globe className="w-3 h-3" />
                          <span>PUBLIC</span>
                        </span>
                      ) : (
                        <span className="px-2.5 py-1 rounded-full bg-[#0F172A]/90 border border-[#1E293B] text-white text-[10px] font-bold flex items-center space-x-1 shadow-md">
                          <Lock className="w-3 h-3 text-amber-400" />
                          <span>PRIVATE</span>
                        </span>
                      )}
                    </div>

                    {isEnrolled && (
                      <span className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-[#2563EB] text-white text-[10px] font-bold flex items-center space-x-1 shadow-md">
                        <CheckCircle className="w-3 h-3" />
                        <span>Enrolled</span>
                      </span>
                    )}
                  </div>

                  {/* Body Content */}
                  <div className="px-6 space-y-3">
                    <div className="flex items-center justify-between text-xs text-[#94A3B8] font-medium">
                      <span>{course.category?.name || 'General'}</span>
                      <span className="px-2 py-0.5 rounded-full bg-[#0F172A] border border-[#1E293B] text-[#F8FAFC] font-semibold">
                        {course.difficulty || 'Beginner'}
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-[#F8FAFC] hover:text-[#06B6D4] transition-colors">
                      {course.title}
                    </h3>
                    <p className="text-xs text-[#94A3B8] line-clamp-2 leading-relaxed">
                      {course.description}
                    </p>

                    <div className="p-3 rounded-xl bg-[#0F172A] border border-[#1E293B] text-xs text-[#94A3B8] space-y-1">
                      <strong className="block text-[#F8FAFC] font-semibold">Teaching Methodology:</strong>
                      <p className="italic">"{course.teachingMethodology}"</p>
                    </div>
                  </div>
                </div>

                {/* Footer Actions */}
                <div className="px-6 pb-6 pt-2">
                  {canWatch ? (
                    <Link to={`/student/course/${course._id}`} className="block">
                      <Button variant="primary" className="w-full space-x-2">
                        <PlayCircle className="w-4 h-4" />
                        <span>Watch Content</span>
                      </Button>
                    </Link>
                  ) : (
                    <Button
                      variant="outline"
                      onClick={() => handleRequestAccess(course.title)}
                      className="w-full text-xs space-x-1.5"
                    >
                      <Lock className="w-3.5 h-3.5 text-amber-500" />
                      <span>Access by Admin Only (Request)</span>
                    </Button>
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};
