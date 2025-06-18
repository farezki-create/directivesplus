
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useFeedbackAdmin } from '@/hooks/useFeedbackAdmin';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

const FeedbackAdminDashboard = () => {
  const { summary, detailedResponses, loading } = useFeedbackAdmin();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">Chargement des données...</div>
      </div>
    );
  }

  const categories = ['all', ...new Set(summary.map(item => item.category))];
  const filteredSummary = selectedCategory === 'all' 
    ? summary 
    : summary.filter(item => item.category === selectedCategory);

  const totalResponders = new Set(detailedResponses.map(r => r.user_id)).size;

  const renderRatingChart = (item: any) => {
    if (item.question_type !== 'rating') return null;

    const chartData = item.responses.map((resp: any) => ({
      rating: `${resp.response_value} étoiles`,
      count: resp.count
    }));

    return (
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="rating" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="count" fill="#8884d8" />
        </BarChart>
      </ResponsiveContainer>
    );
  };

  const renderChoiceChart = (item: any) => {
    if (!['single_choice', 'multiple_choice'].includes(item.question_type)) return null;

    const chartData = item.responses.map((resp: any, index: number) => ({
      name: resp.response_value,
      value: resp.count,
      color: COLORS[index % COLORS.length]
    }));

    return (
      <ResponsiveContainer width="100%" height={200}>
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    );
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Analyse des avis sur l'application</h1>
        <Badge variant="outline" className="text-lg p-2">
          {totalResponders} répondants
        </Badge>
      </div>

      <div className="flex gap-2 flex-wrap">
        {categories.map(category => (
          <Badge
            key={category}
            variant={selectedCategory === category ? "default" : "outline"}
            className="cursor-pointer"
            onClick={() => setSelectedCategory(category)}
          >
            {category === 'all' ? 'Toutes les catégories' : category}
          </Badge>
        ))}
      </div>

      <Tabs defaultValue="summary" className="w-full">
        <TabsList>
          <TabsTrigger value="summary">Vue Synthèse</TabsTrigger>
          <TabsTrigger value="detailed">Vue Détaillée</TabsTrigger>
        </TabsList>

        <TabsContent value="summary" className="space-y-6">
          {filteredSummary.map(item => (
            <Card key={item.question_id}>
              <CardHeader>
                <CardTitle className="text-lg">{item.question_text}</CardTitle>
                <div className="flex gap-2">
                  <Badge variant="secondary">{item.category}</Badge>
                  <Badge variant="outline">{item.total_responses} réponses</Badge>
                </div>
              </CardHeader>
              <CardContent>
                {item.question_type === 'text' ? (
                  <div className="space-y-2">
                    <p className="text-sm text-gray-600">Réponses textuelles (voir l'onglet détaillé)</p>
                  </div>
                ) : item.question_type === 'rating' ? (
                  <div className="space-y-4">
                    {renderRatingChart(item)}
                    <div className="grid grid-cols-5 gap-2">
                      {item.responses.map(resp => (
                        <div key={resp.response_value} className="text-center">
                          <div className="text-sm font-medium">{resp.response_value}★</div>
                          <div className="text-xs text-gray-600">{resp.count} ({resp.percentage}%)</div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {renderChoiceChart(item)}
                    <div className="space-y-2">
                      {item.responses.map(resp => (
                        <div key={resp.response_value} className="flex justify-between items-center">
                          <span className="text-sm">{resp.response_value}</span>
                          <div className="flex items-center gap-2 w-1/2">
                            <Progress value={resp.percentage} className="flex-1" />
                            <span className="text-sm font-medium w-12">{resp.percentage}%</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="detailed" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Toutes les réponses détaillées</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {detailedResponses
                  .filter(resp => selectedCategory === 'all' || resp.category === selectedCategory)
                  .map(response => (
                  <div key={response.id} className="border-l-4 border-blue-500 pl-4 py-2">
                    <div className="font-medium text-sm">{response.question_text}</div>
                    <div className="text-gray-700 mt-1">{response.response_value}</div>
                    <div className="flex gap-2 mt-2">
                      <Badge variant="outline" className="text-xs">
                        {response.category}
                      </Badge>
                      <span className="text-xs text-gray-500">
                        {new Date(response.created_at).toLocaleDateString('fr-FR')}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default FeedbackAdminDashboard;
