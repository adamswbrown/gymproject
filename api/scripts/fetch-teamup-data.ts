import * as fs from 'fs';
import * as path from 'path';

const TEAMUP_DATA_FILE = process.env.TEAMUP_DATA_FILE || path.join(__dirname, '../../teamupdata.json');

// API configuration from curl command
const TEAMUP_API_BASE = 'https://goteamup.com/api/v2/events';
const TEAMUP_AUTH_TOKEN = 'pLCQp5GdjVe6K9itv85L9NyHIvQxWg';
const TEAMUP_PROVIDER_ID = '5289026';

interface TeamUpEventsResponse {
  results: any[];
  next?: string;
  previous?: string;
  count?: number;
}

// Generate monthly chunks from 2026-01-02 to 2026-07-31
function generateMonthlyChunks(): Array<{ start: string; end: string; label: string }> {
  const chunks: Array<{ start: string; end: string; label: string }> = [];

  // January: 2026-01-02 to 2026-01-31
  chunks.push({
    start: '2026-01-02T00:00+00:00',
    end: '2026-01-31T23:59+00:00',
    label: 'Jan 2026'
  });

  // February: 2026-02-01 to 2026-02-28
  chunks.push({
    start: '2026-02-01T00:00+00:00',
    end: '2026-02-28T23:59+00:00',
    label: 'Feb 2026'
  });

  // March: 2026-03-01 to 2026-03-31
  chunks.push({
    start: '2026-03-01T00:00+00:00',
    end: '2026-03-31T23:59+00:00',
    label: 'Mar 2026'
  });

  // April: 2026-04-01 to 2026-04-30
  chunks.push({
    start: '2026-04-01T00:00+00:00',
    end: '2026-04-30T23:59+00:00',
    label: 'Apr 2026'
  });

  // May: 2026-05-01 to 2026-05-31
  chunks.push({
    start: '2026-05-01T00:00+00:00',
    end: '2026-05-31T23:59+00:00',
    label: 'May 2026'
  });

  // June: 2026-06-01 to 2026-06-30
  chunks.push({
    start: '2026-06-01T00:00+00:00',
    end: '2026-06-30T23:59+00:00',
    label: 'Jun 2026'
  });

  // July: 2026-07-01 to 2026-07-31
  chunks.push({
    start: '2026-07-01T00:00+00:00',
    end: '2026-07-31T23:59+00:00',
    label: 'Jul 2026'
  });

  return chunks;
}

// Build query parameters for API request
function buildQueryParams(startsAtGte: string, startsAtLte: string): string {
  const params = new URLSearchParams({
    category: '',
    expand: 'instructors,active_registration_status,category,offering_type,offering_type.category,venue',
    fields: 'id,name,max_occupancy,occupancy,attending_count,starts_at,ends_at,waiting_count,waitlist_max_override,active_registration_status,category.name,offering_type.background_color,offering_type.waitlist_max,offering_type.schedule_type,offering_type.category.name,offering_type.max_allowed_age,offering_type.min_allowed_age,venue,customer_url,description,is_appointment,is_full',
    instructors: '',
    offering_types: '',
    page_size: '100',
    sort: 'start',
    starts_at_gte: startsAtGte,
    starts_at_lte: startsAtLte,
    status: 'active',
    venues: ''
  });

  return params.toString();
}

// Fetch a single page of events
async function fetchEventsPage(url: string): Promise<TeamUpEventsResponse> {
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'accept': 'application/json',
      'authorization': `Token ${TEAMUP_AUTH_TOKEN}`,
      'teamup-provider-id': TEAMUP_PROVIDER_ID,
      'teamup-request-mode': 'customer'
    }
  });

  if (!response.ok) {
    throw new Error(`API request failed: ${response.status} ${response.statusText}`);
  }

  return await response.json();
}

// Fetch all events for a given date range with pagination
async function fetchAllEventsForRange(
  startsAtGte: string,
  startsAtLte: string,
  label: string
): Promise<any[]> {
  console.log(`\nFetching ${label} (${startsAtGte} to ${startsAtLte})...`);
  
  const queryParams = buildQueryParams(startsAtGte, startsAtLte);
  const initialUrl = `${TEAMUP_API_BASE}?${queryParams}`;
  
  const allEvents: any[] = [];
  let currentUrl: string | undefined = initialUrl;
  let pageCount = 0;

  while (currentUrl) {
    pageCount++;
    console.log(`  Page ${pageCount}: ${currentUrl.substring(0, 100)}...`);
    
    const response = await fetchEventsPage(currentUrl);
    
    if (!response.results || !Array.isArray(response.results)) {
      throw new Error('Invalid API response: missing results array');
    }

    allEvents.push(...response.results);
    console.log(`    Fetched ${response.results.length} events (total so far: ${allEvents.length})`);

    // Check for next page
    if (response.next) {
      currentUrl = response.next;
    } else {
      console.log(`  Pagination complete for ${label} (${pageCount} pages)`);
      currentUrl = undefined;
    }
  }

  return allEvents;
}

// Main function to fetch all events
async function fetchAllTeamUpEvents(): Promise<void> {
  console.log('Starting TeamUp data fetch...');
  console.log('Date range: 2026-01-02 to 2026-07-31 (UTC)');
  console.log('Strategy: Monthly chunking with pagination\n');

  const chunks = generateMonthlyChunks();
  const allEvents: any[] = [];
  const monthlyCounts: Record<string, number> = {};

  // Fetch events for each month chunk
  for (const chunk of chunks) {
    try {
      const events = await fetchAllEventsForRange(chunk.start, chunk.end, chunk.label);
      monthlyCounts[chunk.label] = events.length;
      allEvents.push(...events);
      console.log(`  ✓ ${chunk.label}: ${events.length} events`);
    } catch (error) {
      console.error(`  ✗ Error fetching ${chunk.label}:`, error);
      throw error;
    }
  }

  // Prepare response object matching TeamUpEventsResponse format
  const responseData: TeamUpEventsResponse = {
    results: allEvents,
    count: allEvents.length
  };

  // Write to JSON file
  console.log(`\nWriting ${allEvents.length} total events to ${TEAMUP_DATA_FILE}...`);
  fs.writeFileSync(TEAMUP_DATA_FILE, JSON.stringify(responseData, null, 4), 'utf-8');
  console.log('✓ Data saved successfully\n');

  // Print summary
  console.log('='.repeat(60));
  console.log('FETCH SUMMARY');
  console.log('='.repeat(60));
  console.log(`Total events fetched: ${allEvents.length}`);
  console.log('\nCount per month:');
  for (const chunk of chunks) {
    const count = monthlyCounts[chunk.label] || 0;
    console.log(`  ${chunk.label}: ${count} events`);
  }
  console.log('\nPagination status:');
  for (const chunk of chunks) {
    console.log(`  ${chunk.label}: Pagination exhausted ✓`);
  }
  console.log('='.repeat(60));
}

// Run the script
async function main() {
  try {
    await fetchAllTeamUpEvents();
  } catch (error) {
    console.error('Script failed:', error);
    process.exit(1);
  }
}

main();

