import { X, Dices } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { RollResult } from "@/components/character/CharacterSheet";

interface DiceLogSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  rollHistory: RollResult[];
  onClearHistory: () => void;
}

export function DiceLogSidebar({
  isOpen,
  onClose,
  rollHistory,
  onClearHistory,
}: DiceLogSidebarProps) {
  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed right-0 top-0 z-50 h-screen w-full sm:w-[400px] bg-background border-l border-border transition-transform duration-300 ease-in-out",
          isOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-border">
            <div className="flex items-center gap-2">
              <Dices className="h-5 w-5 text-primary" />
              <h2 className="text-lg font-bold">Dice Log</h2>
            </div>
            <div className="flex items-center gap-2">
              {rollHistory.length > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onClearHistory}
                  className="h-8 text-xs"
                >
                  Clear
                </Button>
              )}
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="h-8 w-8"
              >
                <X className="h-4 w-4" />
                <span className="sr-only">Close</span>
              </Button>
            </div>
          </div>

          {/* Content */}
          <ScrollArea className="flex-1 p-4">
            {rollHistory.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center space-y-3 text-muted-foreground py-12">
                <Dices className="h-12 w-12 opacity-20" />
                <div>
                  <p className="font-medium">No rolls yet</p>
                  <p className="text-sm">
                    Roll some dice to see the history here
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                {rollHistory.map((roll) => (
                  <Card key={roll.id} className="overflow-hidden">
                    <CardHeader className="pb-2 bg-muted/30">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <CardTitle className="text-sm font-semibold truncate">
                            {roll.skillName}
                          </CardTitle>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            {roll.linkedAttr.slice(0, 3).toUpperCase()} • {roll.dicePool}d vs DN{roll.dn}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {roll.timestamp.toLocaleTimeString()}
                          </p>
                        </div>
                        <Badge variant={roll.result.success ? "default" : "destructive"} className="shrink-0">
                          {roll.result.success ? "Success" : "Fail"}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-3 pb-3">
                      {/* Result Summary */}
                      <div className="mb-3">
                        {roll.result.success ? (
                          <div className="inline-flex items-center gap-1 px-2 py-1 bg-green-500/10 border border-green-500/20 rounded text-sm text-green-700 dark:text-green-400 font-medium">
                            ✓ {roll.result.icons} icons
                          </div>
                        ) : (
                          <div className="inline-flex items-center gap-1 px-2 py-1 bg-red-500/10 border border-red-500/20 rounded text-sm text-red-700 dark:text-red-400 font-medium">
                            ✗ {roll.result.icons} icons
                          </div>
                        )}
                      </div>

                      {/* Dice Results */}
                      <div className="flex flex-wrap gap-1.5 mb-3">
                        {roll.result.rolls?.slice(0, -1).map((die: number, idx: number) => (
                          <div
                            key={idx}
                            className={cn(
                              "inline-flex items-center justify-center w-8 h-8 rounded-md text-sm font-bold border-2",
                              die === 6
                                ? "bg-yellow-500/20 border-yellow-500 text-yellow-700 dark:text-yellow-300"
                                : die >= roll.dn
                                  ? "bg-green-500/20 border-green-500 text-green-700 dark:text-green-300"
                                  : "bg-muted border-border text-muted-foreground"
                            )}
                          >
                            {die}
                          </div>
                        ))}
                        {roll.result.rolls && roll.result.rolls.length > 0 && (() => {
                          const wrathDie = roll.result.rolls[roll.result.rolls.length - 1];
                          return (
                            <div
                              className={cn(
                                "inline-flex items-center justify-center w-8 h-8 rounded-md text-sm font-bold border-2",
                                wrathDie === 6
                                  ? "bg-purple-500/20 border-purple-500 text-purple-700 dark:text-purple-300"
                                  : wrathDie === 1
                                    ? "bg-red-500/20 border-red-500 text-red-700 dark:text-red-300"
                                    : wrathDie >= roll.dn
                                      ? "bg-green-500/20 border-green-500 text-green-700 dark:text-green-300"
                                      : "bg-muted border-border text-muted-foreground"
                              )}
                            >
                              {wrathDie === 6 ? "⚡" : wrathDie === 1 ? "☠" : wrathDie}
                            </div>
                          );
                        })()}
                      </div>

                      {/* Special Results */}
                      {(roll.result.glory || roll.result.complication || roll.result.shift > 0) && (
                        <div className="flex flex-wrap gap-1.5">
                          {roll.result.glory && (
                            <div className="text-xs px-2 py-1 bg-purple-500/10 border border-purple-500/20 rounded text-purple-700 dark:text-purple-400 font-medium">
                              ⚡ Glory
                            </div>
                          )}
                          {roll.result.complication && (
                            <div className="text-xs px-2 py-1 bg-red-500/10 border border-red-500/20 rounded text-red-700 dark:text-red-400 font-medium">
                              ☠ Complication
                            </div>
                          )}
                          {roll.result.shift > 0 && (
                            <div className="text-xs px-2 py-1 bg-green-500/10 border border-green-500/20 rounded text-green-700 dark:text-green-400 font-medium">
                              +{roll.result.shift} Shift
                            </div>
                          )}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </ScrollArea>
        </div>
      </aside>
    </>
  );
}
