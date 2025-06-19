
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Plus, Settings } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const HealthNewsNavigation = () => {
  const { isAdmin } = useAuth();
  const navigate = useNavigate();

  if (!isAdmin) return null;

  return (
    <div className="flex gap-2 mb-6">
      <Button
        onClick={() => navigate('/admin/health-news')}
        className="flex items-center gap-2"
      >
        <Settings size={16} />
        Gestion des actualités
      </Button>
    </div>
  );
};

export default HealthNewsNavigation;
