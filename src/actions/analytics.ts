'use server';

import connectToDatabase from '@/lib/db';
import EmailCampaign from '@/models/EmailCampaign';
import EmailLog from '@/models/EmailLog';
import Subscriber from '@/models/Subscriber';
import Newsletter from '@/models/Newsletter';
import { auth } from '@/auth';

async function requireAdmin() {
  const session = await auth();
  if (!session || session.user?.role !== 'admin') {
    throw new Error('Unauthorized: Admin access required');
  }
  return session;
}

export async function getMarketingDashboard() {
  try {
    const session = await requireAdmin();

    await connectToDatabase();

    // Campaign stats
    const totalCampaigns = await EmailCampaign.countDocuments({});
    const sentCampaigns = await EmailCampaign.countDocuments({ status: 'sent' });
    const scheduledCampaigns = await EmailCampaign.countDocuments({ status: 'scheduled' });

    // Email stats
    const totalEmails = await EmailLog.countDocuments({});
    const sentEmails = await EmailLog.countDocuments({ status: 'sent' });
    const failedEmails = await EmailLog.countDocuments({ status: 'failed' });
    const openedEmails = await EmailLog.countDocuments({ status: 'opened' });
    const clickedEmails = await EmailLog.countDocuments({ status: 'clicked' });

    // Subscriber stats
    const totalSubscribers = await Subscriber.countDocuments({});
    const activeSubscribers = await Subscriber.countDocuments({ status: 'subscribed' });

    // Recent campaigns (last 5)
    const recentCampaigns = await EmailCampaign.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .lean();

    // Recent email activity (last 10)
    const recentEmailActivity = await EmailLog.find()
      .sort({ createdAt: -1 })
      .limit(10)
      .populate('campaign', 'name')
      .lean();

    const openRate = totalEmails > 0 ? ((openedEmails / totalEmails) * 100).toFixed(2) : '0';
    const clickRate = totalEmails > 0 ? ((clickedEmails / totalEmails) * 100).toFixed(2) : '0';
    const failureRate = totalEmails > 0 ? ((failedEmails / totalEmails) * 100).toFixed(2) : '0';

    return {
      ok: true,
      dashboard: {
        campaigns: {
          total: totalCampaigns,
          sent: sentCampaigns,
          scheduled: scheduledCampaigns,
          recent: recentCampaigns,
        },
        emails: {
          total: totalEmails,
          sent: sentEmails,
          failed: failedEmails,
          opened: openedEmails,
          clicked: clickedEmails,
        },
        subscribers: {
          total: totalSubscribers,
          active: activeSubscribers,
        },
        analytics: {
          openRate: parseFloat(openRate as string),
          clickRate: parseFloat(clickRate as string),
          failureRate: parseFloat(failureRate as string),
          deliveryRate: ((sentEmails / Math.max(totalEmails, 1)) * 100).toFixed(2),
        },
        recentActivity: recentEmailActivity,
      },
    };
  } catch (err: any) {
    return { ok: false, error: err?.message };
  }
}

export async function getCampaignAnalytics(campaignId: string) {
  try {
    const session = await requireAdmin();

    await connectToDatabase();

    const campaign = await EmailCampaign.findById(campaignId).lean();
    if (!campaign) {
      throw new Error('Campaign not found');
    }

    const emailLogs = await EmailLog.find({ campaign: campaignId }).lean();

    const stats = {
      total: campaign.totalRecipients,
      sent: emailLogs.filter((e) => e.status === 'sent').length,
      failed: emailLogs.filter((e) => e.status === 'failed').length,
      opened: emailLogs.filter((e) => e.status === 'opened').length,
      clicked: emailLogs.filter((e) => e.status === 'clicked').length,
      bounced: emailLogs.filter((e) => e.status === 'bounced').length,
    };

    const openRate = stats.sent > 0 ? ((stats.opened / stats.sent) * 100).toFixed(2) : '0';
    const clickRate = stats.sent > 0 ? ((stats.clicked / stats.sent) * 100).toFixed(2) : '0';

    return {
      ok: true,
      campaign,
      stats: {
        ...stats,
        openRate: parseFloat(openRate as string),
        clickRate: parseFloat(clickRate as string),
      },
    };
  } catch (err: any) {
    return { ok: false, error: err?.message };
  }
}

export async function getSubscriberGrowth() {
  try {
    const session = await requireAdmin();

    await connectToDatabase();

    // Get subscriber growth over last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const recentSubscribers = await Subscriber.find({
      createdAt: { $gte: thirtyDaysAgo },
    }).lean();

    // Group by day
    const growthData: { [key: string]: number } = {};
    for (let i = 29; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      growthData[dateStr] = 0;
    }

    recentSubscribers.forEach((sub) => {
      const dateStr = sub.createdAt.toISOString().split('T')[0];
      growthData[dateStr] = (growthData[dateStr] || 0) + 1;
    });

    return {
      ok: true,
      growthData: Object.entries(growthData).map(([date, count]) => ({ date, count })),
    };
  } catch (err: any) {
    return { ok: false, error: err?.message };
  }
}
