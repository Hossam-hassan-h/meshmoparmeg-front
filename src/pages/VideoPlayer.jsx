import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import API from '../services/api';
import { Button, Card, Badge } from '../components/UI';
import { ShieldCheck, ArrowLeft, Lock, CheckCircle, Info, Clock, Award, BookOpen } from 'lucide-react';
import toast from 'react-hot-toast';

export const VideoPlayer = () => {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [accessDenied, setAccessDenied] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const fetchProtectedContent = async () => {
      try {
        const res = await API.get(`/courses/${id}/content`);
        setCourse(res.data);
      } catch (err) {
        setAccessDenied(true);
        const msg = err.response?.data?.message || 'Access Denied: You are not enrolled in this course.';
        setErrorMessage(msg);
        toast.error(msg);
      } finally {
        setLoading(false);
      }
    };
    fetchProtectedContent();
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-20 text-center space-y-4">
        <div className="w-10 h-10 border-4 border-[#2563EB] border-t-transparent rounded-full animate-spin mx-auto"></div>
        <p className="text-sm font-medium text-slate-500">Verifying JWT, Single-Session & Enrollment Gate...</p>
      </div>
    );
  }

  if (accessDenied) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <Card className="p-10 space-y-6 border-red-200 bg-red-50/50">
          <div className="w-14 h-14 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center mx-auto">
            <Lock className="w-7 h-7" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900">403 Forbidden Access</h2>
          <p className="text-slate-600 text-sm leading-relaxed">{errorMessage}</p>
          <div>
            <Link to="/courses">
              <Button variant="outline" className="space-x-2">
                <ArrowLeft className="w-4 h-4" />
                <span>Return to Course Catalog</span>
              </Button>
            </Link>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div>
        <Link to="/student/dashboard" className="inline-flex items-center space-x-2 text-sm font-medium text-slate-600 hover:text-slate-900">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to My Dashboard</span>
        </Link>
      </div>

      {/* Video Player */}
      <div className="space-y-6">
        <div className="relative aspect-video rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 shadow-2xl">
          {course?.video?.url ? (
            <video
              src={course.video.url}
              controls
              controlsList="nodownload"
              poster={course.thumbnail?.url}
              className="w-full h-full object-contain"
            >
              Your browser does not support HTML5 video playback.
            </video>
          ) : (
            <div className="w-full h-full flex items-center justify-center text-slate-400 text-sm">
              No video stream source found
            </div>
          )}
        </div>

        {/* Course Info Card */}
        <Card className="space-y-6 !p-8">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#E2E8F0] pb-4">
            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <Badge variant="accent">{course?.category?.name || 'Engineering'}</Badge>
                <Badge variant="primary">{course?.difficulty || 'Beginner'}</Badge>
              </div>
              <h1 className="text-2xl font-extrabold text-slate-900">{course?.title}</h1>
            </div>

            <Badge variant="success" className="py-1 px-3 text-xs">
              <CheckCircle className="w-4 h-4 mr-1" />
              <span>Verified Streaming Token</span>
            </Badge>
          </div>

          <p className="text-slate-700 text-sm leading-relaxed">{course?.description}</p>

          <div className="p-4 rounded-xl bg-slate-50 border border-[#E2E8F0] space-y-1">
            <h4 className="text-xs font-bold text-slate-900 uppercase flex items-center space-x-1.5">
              <Info className="w-4 h-4 text-[#2563EB]" />
              <span>Teaching Methodology</span>
            </h4>
            <p className="text-sm text-slate-600 italic">"{course?.teachingMethodology}"</p>
          </div>

          {/* Requirements & Learning Outcomes */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
            {course?.requirements && course.requirements.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-slate-900 uppercase">Prerequisites & Requirements</h4>
                <ul className="space-y-1 text-xs text-slate-600">
                  {course.requirements.map((req, idx) => (
                    <li key={idx} className="flex items-center space-x-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#2563EB]"></span>
                      <span>{req}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {course?.learningOutcomes && course.learningOutcomes.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-slate-900 uppercase">What You Will Learn</h4>
                <ul className="space-y-1 text-xs text-slate-600">
                  {course.learningOutcomes.map((out, idx) => (
                    <li key={idx} className="flex items-center space-x-2">
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
                      <span>{out}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};
