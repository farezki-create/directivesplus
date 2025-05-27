
import React from "react";
import { Button } from "@/components/ui/button";
import { Smile, X } from "lucide-react";

interface MoodSelectorProps {
  selectedMood: string;
  onMoodSelect: (mood: string) => void;
  onMoodRemove: () => void;
}

const MoodSelector = ({ selectedMood, onMoodSelect, onMoodRemove }: MoodSelectorProps) => {
  const moods = [
    { emoji: "😊", label: "Heureux" },
    { emoji: "😔", label: "Triste" },
    { emoji: "😌", label: "Serein" },
    { emoji: "💪", label: "Fort" },
    { emoji: "🤔", label: "Pensif" },
    { emoji: "😇", label: "Paisible" },
    { emoji: "💛", label: "Reconnaissant" },
    { emoji: "🌟", label: "Optimiste" }
  ];

  return (
    <>
      {/* Mood Selector */}
      <div className="relative group">
        <Button variant="ghost" size="sm" className="text-gray-500 hover:text-purple-600">
          <Smile className="mr-2 h-4 w-4" />
          Humeur
        </Button>
        <div className="absolute bottom-full left-0 mb-2 bg-white border rounded-lg shadow-lg p-3 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
          <div className="grid grid-cols-4 gap-2 w-64">
            {moods.map((mood) => (
              <Button
                key={mood.label}
                variant="ghost"
                size="sm"
                onClick={() => onMoodSelect(`${mood.emoji} ${mood.label}`)}
                className="flex flex-col items-center p-2 h-auto hover:bg-purple-50"
              >
                <span className="text-xl mb-1">{mood.emoji}</span>
                <span className="text-xs">{mood.label}</span>
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Selected Mood Display */}
      {selectedMood && (
        <div className="mt-3 flex items-center space-x-2">
          <span className="text-sm text-gray-600">Humeur:</span>
          <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm">
            {selectedMood}
          </span>
          <Button
            variant="ghost"
            size="sm"
            onClick={onMoodRemove}
            className="h-6 w-6 rounded-full"
          >
            <X className="h-3 w-3" />
          </Button>
        </div>
      )}
    </>
  );
};

export default MoodSelector;
