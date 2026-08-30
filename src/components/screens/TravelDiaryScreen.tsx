import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { BookOpen, Camera, MapPin, Calendar, Star, Route, Plus, Trash2 } from "lucide-react";
import GlobalHeader from "@/components/GlobalHeader";
import { USE_MOCK } from "@/lib/mock";
import { diaryApi, type ApiDiaryEntry, type DiaryEntryInput } from "@/services/api";
import { useToast } from "@/hooks/use-toast";

/** A blank entry form. `entry_date` defaults to today, the common case. */
const emptyDraft = (): DiaryEntryInput & { tagsText: string } => ({
  title: "",
  body: "",
  location: "",
  distance_km: undefined,
  rating: undefined,
  weather: "",
  entry_date: new Date().toISOString().slice(0, 10),
  tagsText: "",
});

const TravelDiaryScreen = () => {
  const [selectedTab, setSelectedTab] = useState("entries");
  const [draft, setDraft] = useState<(DiaryEntryInput & { tagsText: string }) | null>(null);
  const [entryToDelete, setEntryToDelete] = useState<ApiDiaryEntry | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // The diary is private, so there is nothing to show without a session — and
  // nothing sensible to mock either. In mock mode it simply reads empty.
  const entriesQuery = useQuery({
    queryKey: ["diary", "entries"],
    queryFn: () => diaryApi.list(),
    enabled: !USE_MOCK,
  });

  const statsQuery = useQuery({
    queryKey: ["diary", "stats"],
    queryFn: () => diaryApi.stats(),
    enabled: !USE_MOCK,
  });

  const photosQuery = useQuery({
    queryKey: ["diary", "photos"],
    queryFn: () => diaryApi.photos(),
    enabled: !USE_MOCK && selectedTab === "photos",
  });

  const diaryEntries: ApiDiaryEntry[] = entriesQuery.data?.data?.entries ?? [];
  const photos = photosQuery.data?.data?.photos ?? [];

  const apiStats = statsQuery.data?.data?.stats;
  const stats = {
    totalTrips: apiStats?.total_trips ?? 0,
    totalDistance: `${Math.round(apiStats?.total_distance_km ?? 0).toLocaleString("en-IN")} km`,
    totalPhotos: apiStats?.total_photos ?? 0,
    // An unrated diary has no average. A dash says that; 0 would read as
    // "every trip was terrible".
    averageRating:
      apiStats?.average_rating === null || apiStats?.average_rating === undefined
        ? "—"
        : apiStats.average_rating.toFixed(1),
  };

  const invalidateDiary = () => {
    queryClient.invalidateQueries({ queryKey: ["diary"] });
  };

  const saveEntry = useMutation({
    mutationFn: (entry: DiaryEntryInput) => diaryApi.create(entry),
    onSuccess: () => {
      toast({ title: "Entry saved", description: "Added to your travel diary." });
      setDraft(null);
      invalidateDiary();
    },
    onError: (error: Error) =>
      toast({ title: "Could not save", description: error.message, variant: "destructive" }),
  });

  const deleteEntry = useMutation({
    mutationFn: (id: string) => diaryApi.remove(id),
    onSuccess: () => {
      toast({ title: "Entry deleted" });
      invalidateDiary();
    },
    onError: (error: Error) =>
      toast({ title: "Could not delete", description: error.message, variant: "destructive" }),
  });

  const submitDraft = () => {
    if (!draft) return;
    if (!draft.title.trim()) {
      toast({ title: "Give it a title", variant: "destructive" });
      return;
    }

    const { tagsText, ...entry } = draft;
    saveEntry.mutate({
      ...entry,
      body: entry.body || undefined,
      location: entry.location || undefined,
      weather: entry.weather || undefined,
      // Comma-separated in the form, an array on the wire.
      tags: tagsText
        .split(",")
        .map((tag) => tag.trim().replace(/^#/, ""))
        .filter(Boolean),
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Global Header */}
      <GlobalHeader 
        title="Travel Diary"
        subtitle="Your riding adventures"
        showBack={true}
        showNotifications={true}
      />
      
      {/* New Entry Button */}
      <div className="p-3 border-b bg-white">
        <Button
          size="sm"
          className="bg-orange-500 hover:bg-orange-600 w-full"
          onClick={() => setDraft(draft ? null : emptyDraft())}
        >
          <Plus className="w-4 h-4 mr-1" />
          {draft ? "Cancel" : "New Entry"}
        </Button>
      </div>

      <div className="p-4 space-y-6 pb-20">
        {/* The entry form, shown in place rather than as a modal — writing up a
            trip is the main thing this screen is for. */}
        {draft && (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">New entry</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <Label htmlFor="diary-title">Title</Label>
                <Input
                  id="diary-title"
                  placeholder="e.g. Epic Nandi Hills sunrise"
                  value={draft.title}
                  maxLength={200}
                  onChange={(e) => setDraft({ ...draft, title: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="diary-date">Date of the trip</Label>
                  <Input
                    id="diary-date"
                    type="date"
                    value={draft.entry_date}
                    onChange={(e) => setDraft({ ...draft, entry_date: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="diary-distance">Distance (km)</Label>
                  <Input
                    id="diary-distance"
                    type="number"
                    min={0}
                    placeholder="62"
                    value={draft.distance_km ?? ""}
                    onChange={(e) =>
                      setDraft({
                        ...draft,
                        distance_km: e.target.value ? Number(e.target.value) : undefined,
                      })
                    }
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="diary-location">Where</Label>
                  <Input
                    id="diary-location"
                    placeholder="Nandi Hills, Karnataka"
                    value={draft.location ?? ""}
                    onChange={(e) => setDraft({ ...draft, location: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="diary-weather">Weather</Label>
                  <Input
                    id="diary-weather"
                    placeholder="Clear, 18°C"
                    value={draft.weather ?? ""}
                    onChange={(e) => setDraft({ ...draft, weather: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <Label>Rating</Label>
                <div className="flex items-center gap-1 mt-1">
                  {[1, 2, 3, 4, 5].map((value) => (
                    <button
                      key={value}
                      type="button"
                      aria-label={`${value} star${value > 1 ? "s" : ""}`}
                      onClick={() =>
                        // Tapping the current rating clears it, so a trip can be
                        // left unrated rather than stuck at one star.
                        setDraft({ ...draft, rating: draft.rating === value ? undefined : value })
                      }
                    >
                      <Star
                        className={`w-6 h-6 ${
                          value <= (draft.rating ?? 0)
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-gray-300"
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <Label htmlFor="diary-body">How was it?</Label>
                <Textarea
                  id="diary-body"
                  rows={4}
                  placeholder="What you want to remember about this one."
                  value={draft.body ?? ""}
                  onChange={(e) => setDraft({ ...draft, body: e.target.value })}
                />
              </div>

              <div>
                <Label htmlFor="diary-tags">Tags</Label>
                <Input
                  id="diary-tags"
                  placeholder="sunrise, hills, photography"
                  value={draft.tagsText}
                  onChange={(e) => setDraft({ ...draft, tagsText: e.target.value })}
                />
              </div>

              <div className="flex gap-3 pt-1">
                <Button variant="outline" className="flex-1" onClick={() => setDraft(null)}>
                  Cancel
                </Button>
                <Button
                  className="flex-1 bg-orange-500 hover:bg-orange-600"
                  onClick={submitDraft}
                  disabled={saveEntry.isPending}
                >
                  {saveEntry.isPending ? "Saving..." : "Save entry"}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Stats Overview */}
        <div className="grid grid-cols-2 gap-3">
          <Card className="text-center p-3">
            <div className="text-2xl font-bold text-orange-600">{stats.totalTrips}</div>
            <div className="text-xs text-gray-600">Total Trips</div>
          </Card>
          <Card className="text-center p-3">
            <div className="text-2xl font-bold text-blue-600">{stats.totalDistance}</div>
            <div className="text-xs text-gray-600">Distance</div>
          </Card>
          <Card className="text-center p-3">
            <div className="text-2xl font-bold text-green-600">{stats.totalPhotos}</div>
            <div className="text-xs text-gray-600">Photos</div>
          </Card>
          <Card className="text-center p-3">
            <div className="text-2xl font-bold text-purple-600">{stats.averageRating}</div>
            <div className="text-xs text-gray-600">Avg Rating</div>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs value={selectedTab} onValueChange={setSelectedTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="entries">Entries</TabsTrigger>
            <TabsTrigger value="photos">Photos</TabsTrigger>
            <TabsTrigger value="routes">Routes</TabsTrigger>
          </TabsList>

          <TabsContent value="entries" className="space-y-4 mt-4">
            {entriesQuery.isPending && !USE_MOCK ? (
              <p className="text-center text-sm text-gray-500 py-8">Loading your diary…</p>
            ) : diaryEntries.length === 0 ? (
              <Card className="p-8 text-center">
                <BookOpen className="w-12 h-12 mx-auto text-gray-400 mb-3" />
                <h3 className="text-lg font-medium text-gray-900 mb-1">No entries yet</h3>
                <p className="text-gray-600 mb-4">Write up a ride while you still remember it.</p>
                <Button
                  className="bg-orange-500 hover:bg-orange-600"
                  onClick={() => setDraft(emptyDraft())}
                >
                  Write your first entry
                </Button>
              </Card>
            ) : (
              diaryEntries.map((entry) => (
                <Card key={entry.id}>
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start gap-3">
                      <div className="min-w-0">
                        <CardTitle className="text-lg">{entry.title}</CardTitle>
                        <div className="flex items-center gap-4 text-sm text-gray-600 mt-1 flex-wrap">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {new Date(entry.entry_date).toLocaleDateString()}
                          </div>
                          {entry.location && (
                            <div className="flex items-center gap-1">
                              <MapPin className="w-3 h-3" />
                              {entry.location}
                            </div>
                          )}
                        </div>
                      </div>
                      {/* Only drawn when the rider actually rated the trip —
                          five empty stars would imply a rating of zero. */}
                      {entry.rating !== null && (
                        <div className="flex items-center gap-1 shrink-0">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-4 h-4 ${
                                i < (entry.rating ?? 0)
                                  ? "fill-yellow-400 text-yellow-400"
                                  : "text-gray-300"
                              }`}
                            />
                          ))}
                        </div>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {entry.body && <p className="text-sm text-gray-700">{entry.body}</p>}

                    {entry.photos.length > 0 && (
                      <div className="grid grid-cols-3 gap-2">
                        {entry.photos.slice(0, 6).map((photo) => (
                          <img
                            key={photo.id}
                            src={photo.photo_url}
                            alt={photo.caption ?? entry.title}
                            loading="lazy"
                            className="aspect-square object-cover rounded-lg w-full"
                          />
                        ))}
                      </div>
                    )}

                    {entry.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {entry.tags.map((tag) => (
                          <Badge key={tag} variant="secondary" className="text-xs">
                            #{tag}
                          </Badge>
                        ))}
                      </div>
                    )}

                    <div className="flex justify-between items-center text-sm text-gray-600 pt-2 border-t">
                      <div className="flex items-center gap-4">
                        {entry.distance_km !== null && (
                          <div className="flex items-center gap-1">
                            <Route className="w-3 h-3" />
                            {entry.distance_km} km
                          </div>
                        )}
                        <div className="flex items-center gap-1">
                          <Camera className="w-3 h-3" />
                          {entry.photo_count} photos
                        </div>
                        {entry.weather && <span className="text-xs">{entry.weather}</span>}
                      </div>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-red-500"
                        onClick={() => setEntryToDelete(entry)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>

          <TabsContent value="photos" className="mt-4">
            {photos.length === 0 ? (
              <Card className="p-8 text-center text-gray-500">
                <Camera className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                <p>Photos you attach to an entry appear here.</p>
              </Card>
            ) : (
              <div className="grid grid-cols-3 gap-2">
                {photos.map((photo) => (
                  <img
                    key={photo.id}
                    src={photo.photo_url}
                    alt={photo.caption ?? "Diary photo"}
                    loading="lazy"
                    className="aspect-square object-cover rounded-lg w-full"
                  />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="routes" className="space-y-4 mt-4">
            <Card>
              <CardContent className="p-4">
                <div className="text-center text-gray-500">
                  <Route className="w-12 h-12 mx-auto mb-2" />
                  <p>Saved routes are not built yet.</p>
                  <p className="text-xs mt-1">They arrive with the route planner.</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      <AlertDialog
        open={entryToDelete !== null}
        onOpenChange={(open) => !open && setEntryToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this entry?</AlertDialogTitle>
            <AlertDialogDescription>
              "{entryToDelete?.title}" and its photos will be removed. This cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Keep it</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (entryToDelete) deleteEntry.mutate(entryToDelete.id);
                setEntryToDelete(null);
              }}
            >
              Delete entry
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default TravelDiaryScreen;
