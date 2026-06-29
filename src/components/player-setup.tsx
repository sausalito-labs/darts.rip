import {
  closestCenter,
  DndContext,
  type DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { ArrowLeft, GripVertical, Plus, Shuffle, Trash2 } from 'lucide-react';
import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useGameStore } from '@/store/game-store';

interface SortablePlayerItemProps {
  player: { id: string; name: string; color: string };
  onUpdate: (id: string, name: string) => void;
  onRemove: (id: string) => void;
}

function SortablePlayerItem({ player, onUpdate, onRemove }: SortablePlayerItemProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: player.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 10 : undefined,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-center gap-2 rounded-lg border border-border bg-card p-3"
    >
      <button
        type="button"
        {...attributes}
        {...listeners}
        className="touch-none text-muted-foreground hover:text-foreground"
      >
        <GripVertical className="h-5 w-5" />
      </button>
      <div className="h-8 w-8 shrink-0 rounded-full" style={{ backgroundColor: player.color }} />
      <Input
        value={player.name}
        onChange={(e) => onUpdate(player.id, e.target.value)}
        className="flex-1"
      />
      <Button variant="ghost" size="icon" onClick={() => onRemove(player.id)}>
        <Trash2 className="h-4 w-4 text-destructive" />
      </Button>
    </div>
  );
}

export function PlayerSetup() {
  const navigate = useNavigate();
  const players = useGameStore((s) => s.players);
  const addPlayer = useGameStore((s) => s.addPlayer);
  const removePlayer = useGameStore((s) => s.removePlayer);
  const reorderPlayers = useGameStore((s) => s.reorderPlayers);
  const updatePlayerName = useGameStore((s) => s.updatePlayerName);
  const randomizePlayers = useGameStore((s) => s.randomizePlayers);
  const startGame = useGameStore((s) => s.startGame);
  const setStep = useGameStore((s) => s.setStep);
  const modeId = useGameStore((s) => s.currentModeId);

  const isMounted = useRef(false);

  useEffect(() => {
    if (isMounted.current) return;
    isMounted.current = true;

    if (players.length === 0) {
      addPlayer('');
      addPlayer('');
    }
  }, [players.length, addPlayer]);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = players.findIndex((p) => p.id === active.id);
      const newIndex = players.findIndex((p) => p.id === over.id);
      reorderPlayers(arrayMove(players, oldIndex, newIndex));
    }
  };

  return (
    <div className="mx-auto max-w-xl">
      <Button variant="ghost" className="mb-4" onClick={() => setStep('rules')}>
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back
      </Button>

      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Players</CardTitle>
          <CardDescription>
            Add players, rename them, drag to reorder, or randomize.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={players.map((p) => p.id)}
              strategy={verticalListSortingStrategy}
            >
              <div className="space-y-2">
                {players.map((player) => (
                  <SortablePlayerItem
                    key={player.id}
                    player={player}
                    onUpdate={updatePlayerName}
                    onRemove={removePlayer}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>

          {players.length === 0 && (
            <p className="text-center text-sm text-muted-foreground">
              Add at least one player to start.
            </p>
          )}

          <div className="flex flex-wrap gap-2 pt-2">
            <Button size="sm" variant="outline" onClick={() => addPlayer('')}>
              <Plus className="mr-1 h-4 w-4" />
              Add Player
            </Button>
            {players.length > 1 && (
              <Button size="sm" variant="outline" onClick={randomizePlayers}>
                <Shuffle className="mr-1 h-4 w-4" />
                Randomize
              </Button>
            )}
          </div>

          <div className="flex gap-2 pt-2">
            <Button variant="outline" className="flex-1" onClick={() => navigate('/')}>
              Cancel
            </Button>
            <Button
              className="flex-1"
              disabled={players.length === 0}
              onClick={() => {
                startGame();
                navigate(`/${modeId}`);
              }}
            >
              Start Game
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
