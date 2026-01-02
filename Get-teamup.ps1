# ==============================
# TeamUp Event Export Script
# Date range: 2026-01-02 → 2026-07-31 (UTC)
# ==============================

$BaseUrl = "https://goteamup.com/api/v2/events"
$Token = "REPLACE_WITH_TOKEN"
$ProviderId = "5289026"

$Headers = @{
    "accept" = "application/json"
    "authorization" = "Token $Token"
    "teamup-provider-id" = $ProviderId
}

# Helper: Get month ranges
function Get-MonthRanges {
    param (
        [DateTime]$Start,
        [DateTime]$End
    )

    $ranges = @()
    $current = $Start

    while ($current -le $End) {
        $monthStart = Get-Date -Year $current.Year -Month $current.Month -Day 1 -Hour 0 -Minute 0 -Second 0 -Kind Utc
        if ($monthStart -lt $Start) { $monthStart = $Start }

        $monthEnd = $monthStart.AddMonths(1).AddSeconds(-1)
        if ($monthEnd -gt $End) { $monthEnd = $End }

        $ranges += [PSCustomObject]@{
            Start = $monthStart
            End   = $monthEnd
        }

        $current = $monthStart.AddMonths(1)
    }

    return $ranges
}

# Date bounds
$GlobalStart = [DateTime]"2026-01-02T00:00:00Z"
$GlobalEnd   = [DateTime]"2026-07-31T23:59:00Z"

$MonthRanges = Get-MonthRanges -Start $GlobalStart -End $GlobalEnd

$AllEvents = @()
$MonthlyCounts = @{}

foreach ($range in $MonthRanges) {
    $page = 1
    $monthKey = $range.Start.ToString("yyyy-MM")
    $MonthlyCounts[$monthKey] = 0

    Write-Host "`nFetching month: $monthKey"

    do {
        $query = @{
            category = ""
            expand = "instructors,active_registration_status,category,offering_type,offering_type.category,venue"
            fields = "id,name,max_occupancy,occupancy,attending_count,starts_at,ends_at,waiting_count,waitlist_max_override,active_registration_status,category.name,offering_type.background_color,offering_type.waitlist_max,offering_type.schedule_type,offering_type.category.name,offering_type.max_allowed_age,offering_type.min_allowed_age,venue,customer_url,description,is_appointment,is_full"
            page_size = 100
            sort = "start"
            status = "active"
            starts_at_gte = $range.Start.ToString("yyyy-MM-ddTHH:mm+00:00")
            starts_at_lte = $range.End.ToString("yyyy-MM-ddTHH:mm+00:00")
            page = $page
        }

        $uri = $BaseUrl + "?" + ($query.GetEnumerator() | ForEach-Object {
            "$($_.Key)=$([System.Web.HttpUtility]::UrlEncode($_.Value))"
        } -join "&")

        Write-Host "  Page $page"

        $response = Invoke-RestMethod -Method GET -Uri $uri -Headers $Headers

        if ($response.results.Count -gt 0) {
            $AllEvents += $response.results
            $MonthlyCounts[$monthKey] += $response.results.Count
            $page++
        }

    } while ($response.next -ne $null)
}

# ==============================
# Summary Output
# ==============================

Write-Host "`n=============================="
Write-Host "TeamUp Export Summary"
Write-Host "=============================="

foreach ($key in $MonthlyCounts.Keys | Sort-Object) {
    Write-Host "$key : $($MonthlyCounts[$key]) events"
}

Write-Host "------------------------------"
Write-Host "TOTAL EVENTS: $($AllEvents.Count)"
Write-Host "=============================="

# Optional: save raw JSON
# $AllEvents | ConvertTo-Json -Depth 10 | Out-File "teamup-events-2026.json"