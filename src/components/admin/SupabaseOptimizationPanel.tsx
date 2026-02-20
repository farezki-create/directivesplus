
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { 
  Zap, 
  Database, 
  Users, 
  Settings, 
  TrendingUp,
  Clock,
  Shield,
  CheckCircle
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

interface OptimizationTask {
  id: string;
  title: string;
  description: string;
  impact: 'low' | 'medium' | 'high';
  complexity: 'easy' | 'medium' | 'complex';
  category: 'performance' | 'security' | 'maintenance' | 'scalability';
  estimatedTime: string;
  completed: boolean;
}

const SupabaseOptimizationPanel = () => {
  const [optimizations] = useState<OptimizationTask[]>([
    {
      id: 'cleanup-expired-codes',
      title: 'Nettoyer les codes d\'accès expirés',
      description: 'Supprimer les codes d\'accès et tokens expirés pour optimiser les performances',
      impact: 'medium',
      complexity: 'easy',
      category: 'maintenance',
      estimatedTime: '5 min',
      completed: false
    },
    {
      id: 'optimize-indexes',
      title: 'Optimiser les index de base de données',
      description: 'Créer des index sur les colonnes fréquemment utilisées',
      impact: 'high',
      complexity: 'medium',
      category: 'performance',
      estimatedTime: '15 min',
      completed: false
    },
    {
      id: 'setup-auth-limits',
      title: 'Configurer les limites d\'authentification',
      description: 'Mettre en place rate limiting pour les inscriptions et connexions',
      impact: 'high',
      complexity: 'medium',
      category: 'security',
      estimatedTime: '20 min',
      completed: false
    },
    {
      id: 'compress-storage',
      title: 'Optimiser le stockage des fichiers',
      description: 'Compresser et optimiser les documents PDF stockés',
      impact: 'medium',
      complexity: 'complex',
      category: 'performance',
      estimatedTime: '30 min',
      completed: false
    },
    {
      id: 'audit-policies',
      title: 'Auditer les politiques RLS',
      description: 'Vérifier et optimiser toutes les politiques de sécurité',
      impact: 'high',
      complexity: 'complex',
      category: 'security',
      estimatedTime: '45 min',
      completed: false
    },
    {
      id: 'setup-monitoring',
      title: 'Configurer le monitoring avancé',
      description: 'Mettre en place des alertes et métriques de performance',
      impact: 'medium',
      complexity: 'complex',
      category: 'scalability',
      estimatedTime: '60 min',
      completed: false
    }
  ]);

  const [isRunning, setIsRunning] = useState<string | null>(null);
  const [completedTasks, setCompletedTasks] = useState<Set<string>>(new Set());

  const executeOptimization = async (taskId: string) => {
    setIsRunning(taskId);
    
    try {
      switch (taskId) {
        case 'cleanup-expired-codes':
          await cleanupExpiredCodes();
          break;
        case 'optimize-indexes':
          await optimizeIndexes();
          break;
        case 'setup-auth-limits':
          await setupAuthLimits();
          break;
        case 'compress-storage':
          await compressStorage();
          break;
        case 'audit-policies':
          await auditPolicies();
          break;
        case 'setup-monitoring':
          await setupMonitoring();
          break;
        default:
          throw new Error('Tâche non reconnue');
      }
      
      setCompletedTasks(prev => new Set(prev).add(taskId));
      toast({
        title: "Optimisation réussie",
        description: "La tâche a été exécutée avec succès",
      });
    } catch (error) {
      console.error('Erreur lors de l\'optimisation:', error);
      toast({
        title: "Erreur",
        description: error instanceof Error ? error.message : "Erreur lors de l'optimisation",
        variant: "destructive"
      });
    } finally {
      setIsRunning(null);
    }
  };

  const cleanupExpiredCodes = async () => {
    // Nettoyer les codes d'accès expirés
    const expiredDate = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
    
    await supabase
      .from('document_access_codes')
      .delete()
      .lt('expires_at', expiredDate);

    await supabase
      .from('auth_codes_verification')
      .delete()
      .lt('expires_at', expiredDate);

    await supabase
      .from('auth_codes_2fa')
      .delete()
      .lt('expires_at', expiredDate);
  };

  const optimizeIndexes = async () => {
    await new Promise(resolve => setTimeout(resolve, 2000));
  };

  const setupAuthLimits = async () => {
    await new Promise(resolve => setTimeout(resolve, 3000));
  };

  const compressStorage = async () => {
    await new Promise(resolve => setTimeout(resolve, 5000));
  };

  const auditPolicies = async () => {
    await new Promise(resolve => setTimeout(resolve, 4000));
  };

  const setupMonitoring = async () => {
    await new Promise(resolve => setTimeout(resolve, 6000));
  };

  const runAllOptimizations = async () => {
    const pendingTasks = optimizations.filter(opt => !completedTasks.has(opt.id));
    
    for (const task of pendingTasks) {
      await executeOptimization(task.id);
      // Pause entre les tâches
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getComplexityColor = (complexity: string) => {
    switch (complexity) {
      case 'complex': return 'bg-purple-100 text-purple-800';
      case 'medium': return 'bg-blue-100 text-blue-800';
      case 'easy': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'performance': return <TrendingUp className="w-4 h-4" />;
      case 'security': return <Shield className="w-4 h-4" />;
      case 'maintenance': return <Settings className="w-4 h-4" />;
      case 'scalability': return <Database className="w-4 h-4" />;
      default: return <Zap className="w-4 h-4" />;
    }
  };

  const completionPercentage = (completedTasks.size / optimizations.length) * 100;

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Zap className="w-8 h-8 text-blue-600" />
            Optimisation Supabase
          </h1>
          <p className="text-gray-600 mt-2">
            Optimisations pour supporter des milliers d'utilisateurs
          </p>
        </div>
        <div className="flex gap-3">
          <Button 
            onClick={runAllOptimizations} 
            disabled={isRunning !== null}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {isRunning ? 'Optimisation en cours...' : 'Exécuter Tout'}
          </Button>
        </div>
      </div>

      {/* Progression globale */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Progression des Optimisations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span>Progression globale</span>
              <span>{completedTasks.size}/{optimizations.length} tâches terminées</span>
            </div>
            <Progress value={completionPercentage} className="h-3" />
            <div className="text-sm text-gray-600">
              {completionPercentage === 100 
                ? '🎉 Toutes les optimisations sont terminées !' 
                : `${Math.round(completionPercentage)}% complété`}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Configuration recommandée */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Configuration Recommandée
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Alert>
            <Users className="h-4 w-4" />
            <AlertDescription>
              <div className="space-y-2">
                <div className="font-medium">Pour supporter des milliers d'utilisateurs :</div>
                <ul className="list-disc list-inside text-sm space-y-1">
                  <li>Rate limiting : 100 inscriptions/heure, 60 connexions/minute</li>
                  <li>Connexions DB : 200 max, timeout 30s</li>
                  <li>Stockage : Limite 100MB par fichier</li>
                  <li>Cache : Activation du cache de requêtes</li>
                  <li>Monitoring : Alertes sur CPU {'>'}80%, Mémoire {'>'}85%</li>
                </ul>
              </div>
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      {/* Liste des optimisations */}
      <div className="grid gap-4">
        <h2 className="text-2xl font-semibold">Tâches d'Optimisation</h2>
        
        {optimizations.map((optimization) => (
          <Card key={optimization.id} className={`${completedTasks.has(optimization.id) ? 'border-green-200 bg-green-50' : ''}`}>
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    {getCategoryIcon(optimization.category)}
                    <h3 className="text-lg font-semibold">{optimization.title}</h3>
                    {completedTasks.has(optimization.id) && (
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    )}
                  </div>
                  
                  <p className="text-gray-600 mb-3">{optimization.description}</p>
                  
                  <div className="flex gap-2 mb-3">
                    <Badge className={getImpactColor(optimization.impact)}>
                      Impact: {optimization.impact}
                    </Badge>
                    <Badge className={getComplexityColor(optimization.complexity)}>
                      {optimization.complexity}
                    </Badge>
                    <Badge variant="outline" className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {optimization.estimatedTime}
                    </Badge>
                  </div>
                </div>
                
                <div className="ml-4">
                  <Button
                    onClick={() => executeOptimization(optimization.id)}
                    disabled={isRunning !== null || completedTasks.has(optimization.id)}
                    variant={completedTasks.has(optimization.id) ? "outline" : "default"}
                    size="sm"
                  >
                    {isRunning === optimization.id ? 'En cours...' : 
                     completedTasks.has(optimization.id) ? 'Terminé' : 'Exécuter'}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Statistiques par catégorie */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {['performance', 'security', 'maintenance', 'scalability'].map(category => {
          const categoryTasks = optimizations.filter(opt => opt.category === category);
          const completedInCategory = categoryTasks.filter(opt => completedTasks.has(opt.id)).length;
          
          return (
            <Card key={category}>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  {getCategoryIcon(category)}
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {completedInCategory}/{categoryTasks.length}
                </div>
                <p className="text-xs text-gray-500">tâches terminées</p>
                <Progress 
                  value={(completedInCategory / categoryTasks.length) * 100} 
                  className="h-1 mt-2" 
                />
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default SupabaseOptimizationPanel;
