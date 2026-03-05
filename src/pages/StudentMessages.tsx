import { useEffect, useState, useCallback } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { MessageSquare, Send, Trash2 } from "lucide-react";
import { collection, addDoc, getDocs, query, where, orderBy, Timestamp, deleteDoc, doc } from "firebase/firestore";
import { db } from "@/integrations/firebase/client";
import { useTranslation } from "react-i18next";

export default function StudentMessages() {
  const { user, profile } = useAuth();
  const { toast } = useToast();
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [messages, setMessages] = useState<Array<any>>([]);
  const [selected, setSelected] = useState<any | null>(null);
  const [replies, setReplies] = useState<Array<any>>([]);
  const [loadingReplies, setLoadingReplies] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [reply, setReply] = useState("");
  const [sending, setSending] = useState(false);

  const loadReplies = useCallback(async (messageId: string) => {
    setLoadingReplies(true);
    try {
      const q = query(
        collection(db, "studentFeedback", messageId, "replies"),
        orderBy("createdAt", "asc")
      );
      const snap = await getDocs(q);
      const data = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      setReplies(data);
    } catch (e) {
      console.error(e);
      setReplies([]);
    } finally {
      setLoadingReplies(false);
    }
  }, []);

  const loadMessages = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      console.log("Loading messages for user:", user.uid);
      const q = query(
        collection(db, "studentFeedback"),
        where("userId", "==", user.uid)
      );
      const snap = await getDocs(q);
      console.log("Messages found:", snap.docs.length);
      // Sort manually in JavaScript instead of using Firestore orderBy
      const data = snap.docs
        .map(d => ({ id: d.id, ...d.data() }))
        .sort((a: any, b: any) => {
          const aTime = a.createdAt?.toMillis?.() || 0;
          const bTime = b.createdAt?.toMillis?.() || 0;
          return bTime - aTime; // descending order
        });
      console.log("Messages data:", data);
      setMessages(data);
      if (data.length > 0) {
        setSelected(data[0]);
        loadReplies(data[0].id);
      }
    } catch (e: any) {
      console.error("Error loading messages:", e);
      console.error("Error code:", e.code);
      console.error("Error message:", e.message);
      toast({ 
        title: "Error loading messages", 
        description: e.message || "Check console for details", 
        variant: "destructive" 
      });
    } finally {
      setLoading(false);
    }
  }, [user, toast]);

  useEffect(() => {
    loadMessages();
  }, [loadMessages]);

  const sendNewMessage = async () => {
    if (!user || !profile) return;
    if (!newMessage.trim()) {
      toast({ title: t("student.messages.writeMessageError"), description: t("student.messages.writeMessageErrorDesc"), variant: "destructive" });
      return;
    }
    try {
      setSending(true);
      console.log("Sending message with userId:", user.uid);
      const docRef = await addDoc(collection(db, "studentFeedback"), {
        userId: user.uid,
        email: profile.email,
        fullName: profile.full_name,
        departmentId: profile.departmentId || null,
        message: newMessage.trim(),
        status: "open",
        createdAt: Timestamp.now(),
      });
      console.log("Message sent with ID:", docRef.id);
      setNewMessage("");
      toast({ title: t("student.messages.messageSent"), description: t("student.messages.messageSentDesc") });
      loadMessages();
    } catch (e: any) {
      console.error("Error sending message:", e);
      console.error("Error code:", e.code);
      console.error("Error message:", e.message);
      toast({ title: t("student.messages.sendFailed"), description: e.message || t("student.messages.sendFailedDesc"), variant: "destructive" });
    } finally {
      setSending(false);
    }
  };

  const sendReply = async () => {
    if (!user || !selected) return;
    if (!reply.trim()) return;
    try {
      setSending(true);
      await addDoc(collection(db, "studentFeedback", selected.id, "replies"), {
        message: reply.trim(),
        createdAt: Timestamp.now(),
        authorRole: "student",
      });
      setReply("");
      toast({ title: "Reply sent" });
      loadReplies(selected.id);
    } catch (e: any) {
      toast({ title: "Failed to send", description: e.message || "Please try again.", variant: "destructive" });
    } finally {
      setSending(false);
    }
  };

  const deleteMessage = async (messageId: string) => {
    if (!confirm(t("student.messages.deleteConfirm"))) return;
    try {
      await deleteDoc(doc(db, "studentFeedback", messageId));
      toast({ title: t("student.messages.messageDeleted") });
      setSelected(null);
      setReplies([]);
      loadMessages();
    } catch (e: any) {
      toast({ title: t("student.messages.deleteFailed"), description: e.message || t("student.messages.deleteFailedDesc"), variant: "destructive" });
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 animate-fade-in max-w-5xl">
        <div className="flex items-start sm:items-center justify-between">
          <div>
            <h1 className="text-2xl lg:text-3xl font-display font-bold">{t("student.messages.title")}</h1>
            <p className="text-muted-foreground mt-1">{t("student.messages.subtitle")}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="md:col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                Your Messages
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 max-h-[420px] overflow-y-auto">
              {loading ? (
                <div className="text-sm text-muted-foreground">{t("common.loading")}</div>
              ) : messages.length === 0 ? (
                <div className="text-sm text-muted-foreground">{t("student.messages.noMessages")}</div>
              ) : (
                messages.map((m) => (
                  <button
                    key={m.id}
                    onClick={() => {
                      setSelected(m);
                      loadReplies(m.id);
                    }}
                    className={`w-full text-left p-3 rounded-lg border hover:bg-muted transition ${
                      selected?.id === m.id ? "bg-muted" : ""
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <div className="text-sm line-clamp-2">{m.message}</div>
                        <div className="text-xs text-muted-foreground mt-1">
                          {m.createdAt?.toDate?.().toLocaleString?.() || ""}
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 text-destructive hover:text-destructive hover:bg-destructive/10"
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteMessage(m.id);
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </button>
                ))
              )}
            </CardContent>
          </Card>

          <div className="md:col-span-2 space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>{t("student.messages.newMessage")}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Textarea
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder={t("student.messages.writeComment")}
                  rows={4}
                />
                <div className="flex justify-end">
                  <Button onClick={sendNewMessage} disabled={sending}>
                    <Send className="h-4 w-4 mr-2" />
                    {sending ? t("student.messages.sending") : t("student.messages.send")}
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Thread</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {selected ? (
                  <>
                    <div className="p-3 rounded-lg border bg-muted/50 whitespace-pre-wrap">
                      <div className="text-xs text-muted-foreground mb-2">Your message:</div>
                      {selected.message}
                    </div>
                    
                    {/* Display Replies */}
                    {loadingReplies ? (
                      <div className="text-sm text-muted-foreground">Loading replies...</div>
                    ) : replies.length > 0 ? (
                      <div className="space-y-3">
                        <div className="text-sm font-medium">Replies:</div>
                        {replies.map((r) => (
                          <div
                            key={r.id}
                            className={`p-3 rounded-lg border ${
                              r.authorRole === "admin"
                                ? "bg-blue-50 dark:bg-blue-950/20 border-blue-200"
                                : "bg-muted/50"
                            }`}
                          >
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-xs font-medium">
                                {r.authorRole === "admin" ? "Admin" : "You"}
                              </span>
                              <span className="text-xs text-muted-foreground">
                                {r.createdAt?.toDate?.().toLocaleString?.() || ""}
                              </span>
                            </div>
                            <div className="text-sm whitespace-pre-wrap">{r.message}</div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-sm text-muted-foreground">No replies yet.</div>
                    )}
                    
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Reply</label>
                      <Textarea
                        value={reply}
                        onChange={(e) => setReply(e.target.value)}
                        placeholder="Write a reply..."
                        rows={3}
                      />
                      <div className="flex justify-end">
                        <Button onClick={sendReply} disabled={sending || !reply.trim()}>
                          <Send className="h-4 w-4 mr-2" />
                          Send Reply
                        </Button>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="text-sm text-muted-foreground">Select a message to view and reply.</div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
