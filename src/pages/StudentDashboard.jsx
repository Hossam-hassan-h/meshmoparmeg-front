import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Button, Card, Badge } from '../components/UI';
import { PlayCircle, ShieldCheck, BookOpen, Lock, Globe, AlertCircle } from 'lucide-react';

export const StudentDashboard = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchMyCourses = async () => {
      try {
        const res = await API.get('/courses/my-courses');
        setCourses(res.data);
      } catch (err) {
        console.error('Failed to load student workspace courses:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchMyCourses();
  }, []);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center text-sm font-medium text-slate-500">
        Loading Student Workspace...
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      {/* Student Welcome Banner */}
      <Card className="!p-8 bg-gradient-to-r from-slate-900 via-slate-800 to-blue-950 text-white flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border-slate-800">
        <div className="space-y-2">
        
          <h1 className="text-3xl font-extrabold">
            Welcome back, <span className="text-blue-400">{user?.name}</span>
          </h1>
          <p className="text-slate-300 text-sm max-w-xl">
            Access your course learning materials. Single-session security enforces one active session per account.
          </p>
        </div>

        <Link to="/courses" className="shrink-0">
          <Button variant="accent" size="md" className="space-x-2">
            <BookOpen className="w-4 h-4" />
            <span>Browse All Courses</span>
          </Button>
        </Link>
      </Card>

      {/* Courses List */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-900 flex items-center space-x-2">
            <span>Enrolled & Public Courses</span>
            <Badge variant="primary">{courses.length}</Badge>
          </h2>
        </div>

        {courses.length === 0 ? (
          <Card className="p-12 text-center space-y-4">
            <AlertCircle className="w-12 h-12 text-amber-500 mx-auto" />
            <h3 className="text-lg font-bold text-slate-800">No Enrolled Courses Found</h3>
            <p className="text-slate-600 text-sm max-w-md mx-auto">
              You currently have no active course grants. Visit the catalog to view Public courses or request access from your administrator.
            </p>
            <div>
              <Link to="/courses">
                <Button variant="primary">Go to Catalog</Button>
              </Link>
            </div>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {courses.map((course) => (
              <Card key={course._id} hover className="flex flex-col justify-between space-y-6 !p-0 overflow-hidden">
                <div className="space-y-4">
                  <div className="aspect-video relative overflow-hidden bg-slate-100 border-b border-[#E2E8F0]">
                    <img
                      src={course.thumbnail?.url || ''}
                      alt={course.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-3 left-3">
                      {course.accessType === 'PUBLIC' ? (
                        <span className="px-2 py-1 rounded-full bg-emerald-500/90 text-white text-[10px] font-bold flex items-center space-x-1">
                          <Globe className="w-3 h-3" />
                          <span>PUBLIC</span>
                        </span>
                      ) : (
                        <span className="px-2 py-1 rounded-full bg-slate-900/90 text-white text-[10px] font-bold flex items-center space-x-1">
                          <Lock className="w-3 h-3 text-amber-400" />
                          <span>PRIVATE GRANT</span>
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="px-6 space-y-2">
                    <h3 className="text-lg font-bold text-slate-900">{course.title}</h3>
                    <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                      {course.description}
                    </p>
                  </div>
                </div>

                <div className="px-6 pb-6 pt-2">
                  <Link to={`/student/course/${course._id}`} className="block">
                    <Button variant="primary" className="w-full space-x-2">
                      <PlayCircle className="w-4 h-4" />
                      <span>Open Video Player</span>
                    </Button>
                  </Link>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
