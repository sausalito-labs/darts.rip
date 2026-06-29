import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { getMode } from '@/game-engine/registry';

interface ComingSoonPageProps {
  modeId: string;
}

export function ComingSoonPage({ modeId }: ComingSoonPageProps) {
  const navigate = useNavigate();
  const mode = getMode(modeId);

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="mx-auto max-w-xl">
        <Button variant="ghost" className="mb-4" onClick={() => navigate('/')}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>

        <Card className="text-center">
          <CardHeader>
            <CardTitle className="text-3xl">{mode?.name ?? modeId}</CardTitle>
            <CardDescription>{mode?.description}</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              This game mode is coming soon. Check back later!
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
