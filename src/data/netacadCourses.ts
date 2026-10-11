import { NetAcadCourse } from '../types/netacad';

export const INITIAL_NETACAD_COURSES: NetAcadCourse[] = [
  {
    id: 'ccna-itn',
    code: 'CCNA 1 (ITN)',
    title: 'Introduction to Networks v7.02',
    track: 'Networking',
    level: 'Beginner',
    netacadUrl: 'https://www.netacad.com/courses/networking/ccna-introduction-networks',
    enrolled: true,
    totalModules: 17,
    completedModules: 13,
    quizzesCompleted: 13,
    quizzesTotal: 17,
    labsCompleted: 11,
    labsTotal: 15,
    courseFeedbackCompleted: false,
    finalExamPassed: false,
    finalExamScore: undefined,
    letterOfMeritQualified: false,
    digitalBadgeEarned: false,
    targetCompletionDate: '2026-10-25',
    bannerImage: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=1200&q=80',
    modules: [
      {
        id: 'itn-mod-1',
        courseId: 'ccna-itn',
        moduleNumber: 1,
        title: 'Networking Today & Network Topologies',
        description: 'Network components, physical vs logical topology diagrams, LANs, WANs, and cloud convergence.',
        estimatedMinutes: 65,
        status: 'completed',
        quizPassed: true,
        quizScore: 92,
        hasPacketTracerLab: true,
        packetTracerCompleted: true,
        netacadDirectUrl: 'https://www.netacad.com/portal/learning?course=ccna1&mod=1',
        lessons: [
          {
            id: 'itn-l-1-1',
            title: '1.1 Network Components: Hosts, Intermediary Devices & Media',
            type: 'video',
            durationMinutes: 12,
            completed: true,
            directUrl: 'https://www.netacad.com/courses/networking/ccna-introduction-networks#1.1',
            hasTranscript: true,
            transcriptSample: 'Networks consist of end devices, intermediary devices, and network media. End devices either source or receive data. Intermediary devices interconnect end devices and manage data flow across network paths.'
          },
          {
            id: 'itn-l-1-2',
            title: '1.5 Packet Tracer: Network Representation Lab',
            type: 'packet_tracer',
            durationMinutes: 25,
            completed: true,
            directUrl: 'https://www.netacad.com/courses/networking/ccna-introduction-networks#1.5',
            hasTranscript: false
          }
        ]
      },
      {
        id: 'itn-mod-8',
        courseId: 'ccna-itn',
        moduleNumber: 8,
        title: 'Network Layer: IPv4, Subnetting & CIDR',
        description: 'IPv4 structure, binary to decimal conversion, default subnet masks, and VLSM subnetwork planning.',
        estimatedMinutes: 90,
        status: 'completed',
        quizPassed: true,
        quizScore: 88,
        hasPacketTracerLab: true,
        packetTracerCompleted: true,
        netacadDirectUrl: 'https://www.netacad.com/portal/learning?course=ccna1&mod=8',
        lessons: [
          {
            id: 'itn-l-8-1',
            title: '8.1 IPv4 Packet Header Structure and Fields',
            type: 'video',
            durationMinutes: 15,
            completed: true,
            directUrl: 'https://www.netacad.com/courses/networking/ccna-introduction-networks#8.1',
            hasTranscript: true,
            transcriptSample: 'The IPv4 header contains crucial fields: Version, DiffServ, TTL (Time to Live), Protocol, Source IP, and Destination IP. When TTL reaches 0, a router drops the packet and responds with an ICMP Time Exceeded message.'
          },
          {
            id: 'itn-l-8-2',
            title: '8.4 Subnetting IPv4 Networks & Magic Number Calculation',
            type: 'video',
            durationMinutes: 20,
            completed: true,
            directUrl: 'https://www.netacad.com/courses/networking/ccna-introduction-networks#8.4',
            hasTranscript: true,
            transcriptSample: 'Subnetting borrows host bits to create subnets. The formula for number of subnets is 2^n where n is borrowed bits. Valid usable hosts is 2^h - 2 where h is remaining host bits, subtracting 2 for Network ID and Broadcast.'
          },
          {
            id: 'itn-l-8-3',
            title: '8.5.1 Packet Tracer: Subnetting Scenario Lab 1',
            type: 'packet_tracer',
            durationMinutes: 40,
            completed: true,
            directUrl: 'https://www.netacad.com/courses/networking/ccna-introduction-networks#8.5',
            hasTranscript: false
          }
        ]
      },
      {
        id: 'itn-mod-14',
        courseId: 'ccna-itn',
        moduleNumber: 14,
        title: 'Transport Layer: TCP vs UDP & Port Multiplexing',
        description: 'Transport layer reliability, 3-way handshake, TCP windowing, port numbers, and segment headers.',
        estimatedMinutes: 75,
        status: 'in_progress',
        quizPassed: false,
        quizScore: undefined,
        hasPacketTracerLab: true,
        packetTracerCompleted: false,
        netacadDirectUrl: 'https://www.netacad.com/portal/learning?course=ccna1&mod=14',
        lessons: [
          {
            id: 'itn-l-14-1',
            title: '14.1 TCP Connection Establishment & 3-Way Handshake',
            type: 'video',
            durationMinutes: 14,
            completed: true,
            directUrl: 'https://www.netacad.com/courses/networking/ccna-introduction-networks#14.1',
            hasTranscript: true,
            transcriptSample: 'TCP guarantees reliability using sequence numbers and acknowledgments. The 3-way handshake sequence begins with SYN from client, SYN-ACK from server, and concluding ACK from client.'
          },
          {
            id: 'itn-l-14-2',
            title: '14.3 UDP Operation vs TCP Low Overhead',
            type: 'reading',
            durationMinutes: 18,
            completed: false,
            directUrl: 'https://www.netacad.com/courses/networking/ccna-introduction-networks#14.3',
            hasTranscript: true,
            transcriptSample: 'UDP is connectionless with an 8-byte header. Used for real-time traffic like VoIP and DNS where speed is preferred over retransmission delays.'
          },
          {
            id: 'itn-l-14-3',
            title: '14.4 Module 14 Quiz: Transport Layer Protocol Check',
            type: 'quiz',
            durationMinutes: 20,
            completed: false,
            directUrl: 'https://www.netacad.com/courses/networking/ccna-introduction-networks#14.4',
            hasTranscript: false
          }
        ]
      },
      {
        id: 'itn-mod-17',
        courseId: 'ccna-itn',
        moduleNumber: 17,
        title: 'Build a Small Network & Troubleshooting',
        description: 'Router and switch security baseline, ping, traceroute, and final comprehensive PTSA.',
        estimatedMinutes: 110,
        status: 'available',
        quizPassed: false,
        quizScore: undefined,
        hasPacketTracerLab: true,
        packetTracerCompleted: false,
        netacadDirectUrl: 'https://www.netacad.com/portal/learning?course=ccna1&mod=17',
        lessons: [
          {
            id: 'itn-l-17-1',
            title: '17.1 Device Hardening: Enable Secret, SSH & Port Security',
            type: 'video',
            durationMinutes: 22,
            completed: false,
            directUrl: 'https://www.netacad.com/courses/networking/ccna-introduction-networks#17.1',
            hasTranscript: true,
            transcriptSample: 'Securing Cisco IOS devices requires hostname, service password-encryption, enable secret, banner motd, domain-name, crypto key generate rsa, and transport input ssh on line vty 0 4.'
          },
          {
            id: 'itn-l-17-2',
            title: '17.8 Packet Tracer: Skills Assessment Final Capstone (PTSA)',
            type: 'packet_tracer',
            durationMinutes: 60,
            completed: false,
            directUrl: 'https://www.netacad.com/courses/networking/ccna-introduction-networks#17.8',
            hasTranscript: false
          }
        ]
      }
    ]
  },
  {
    id: 'ccna-srwe',
    code: 'CCNA 2 (SRWE)',
    title: 'Switching, Routing, and Wireless Essentials',
    track: 'Networking',
    level: 'Intermediate',
    netacadUrl: 'https://www.netacad.com/courses/networking/ccna-switching-routing-wireless-essentials',
    enrolled: true,
    totalModules: 16,
    completedModules: 6,
    quizzesCompleted: 6,
    quizzesTotal: 16,
    labsCompleted: 5,
    labsTotal: 14,
    courseFeedbackCompleted: false,
    finalExamPassed: false,
    finalExamScore: undefined,
    letterOfMeritQualified: false,
    digitalBadgeEarned: false,
    targetCompletionDate: '2026-11-15',
    bannerImage: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1200&q=80',
    modules: [
      {
        id: 'srwe-mod-3',
        courseId: 'ccna-srwe',
        moduleNumber: 3,
        title: 'VLANs and Inter-VLAN Routing (Router-on-a-Stick)',
        description: 'VLAN configuration, 802.1Q trunking, native VLAN security, and subinterface routing.',
        estimatedMinutes: 80,
        status: 'in_progress',
        quizPassed: false,
        hasPacketTracerLab: true,
        packetTracerCompleted: false,
        netacadDirectUrl: 'https://www.netacad.com/portal/learning?course=ccna2&mod=3',
        lessons: [
          {
            id: 'srwe-l-3-1',
            title: '3.1 VLAN Concept and 802.1Q Trunk Tagging',
            type: 'video',
            durationMinutes: 16,
            completed: true,
            directUrl: 'https://www.netacad.com/courses/networking/ccna-switching-routing-wireless-essentials#3.1',
            hasTranscript: true,
            transcriptSample: 'VLANs segment broadcast domains logically at Layer 2. To transport multiple VLANs across a single physical link, Cisco switches configure IEEE 802.1Q trunking with a 4-byte VLAN tag insert.'
          },
          {
            id: 'srwe-l-3-2',
            title: '3.4 Packet Tracer: Configure Router-on-a-Stick Inter-VLAN Routing',
            type: 'packet_tracer',
            durationMinutes: 35,
            completed: false,
            directUrl: 'https://www.netacad.com/courses/networking/ccna-switching-routing-wireless-essentials#3.4',
            hasTranscript: false
          }
        ]
      },
      {
        id: 'srwe-mod-5',
        courseId: 'ccna-srwe',
        moduleNumber: 5,
        title: 'STP Concepts & Rapid PVST+ Loop Prevention',
        description: 'Spanning Tree Protocol, Root Bridge election, BPDU timers, PortFast, and BPDU Guard.',
        estimatedMinutes: 90,
        status: 'available',
        quizPassed: false,
        hasPacketTracerLab: true,
        packetTracerCompleted: false,
        netacadDirectUrl: 'https://www.netacad.com/portal/learning?course=ccna2&mod=5',
        lessons: [
          {
            id: 'srwe-l-5-1',
            title: '5.2 Root Bridge Election & Priority Values',
            type: 'video',
            durationMinutes: 18,
            completed: false,
            directUrl: 'https://www.netacad.com/courses/networking/ccna-switching-routing-wireless-essentials#5.2',
            hasTranscript: true,
            transcriptSample: 'The switch with the lowest Bridge ID (BID) becomes the Root Bridge. BID consists of Bridge Priority (default 32768) + Extended System ID (VLAN ID) + MAC address. Use spanning-tree vlan 1 priority 4096 or spanning-tree vlan 1 root primary.'
          }
        ]
      }
    ]
  },
  {
    id: 'cyber-ops',
    code: 'CyberOps',
    title: 'CyberOps Associate v1.0',
    track: 'Cybersecurity',
    level: 'Intermediate',
    netacadUrl: 'https://www.netacad.com/courses/cybersecurity/cyberops-associate',
    enrolled: true,
    totalModules: 28,
    completedModules: 18,
    quizzesCompleted: 18,
    quizzesTotal: 28,
    labsCompleted: 14,
    labsTotal: 22,
    courseFeedbackCompleted: false,
    finalExamPassed: false,
    finalExamScore: undefined,
    letterOfMeritQualified: false,
    digitalBadgeEarned: false,
    targetCompletionDate: '2026-12-01',
    bannerImage: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=1200&q=80',
    modules: [
      {
        id: 'co-mod-12',
        courseId: 'cyber-ops',
        moduleNumber: 12,
        title: 'Network Attacks & Threat Actors (MITRE ATT&CK)',
        description: 'Reconnaissance, weaponization, delivery, exploitation, malware analysis, and MITRE framework.',
        estimatedMinutes: 70,
        status: 'in_progress',
        quizPassed: false,
        hasPacketTracerLab: false,
        packetTracerCompleted: false,
        netacadDirectUrl: 'https://www.netacad.com/portal/learning?course=cyberops&mod=12',
        lessons: [
          {
            id: 'co-l-12-1',
            title: '12.1 The Cyber Kill Chain & MITRE Enterprise Matrix',
            type: 'video',
            durationMinutes: 15,
            completed: true,
            directUrl: 'https://www.netacad.com/courses/cybersecurity/cyberops-associate#12.1',
            hasTranscript: true,
            transcriptSample: 'The Lockheed Martin Cyber Kill Chain defines 7 stages of an intrusion: Recon, Weaponization, Delivery, Exploitation, Installation, C2 (Command and Control), and Actions on Objectives.'
          }
        ]
      }
    ]
  },
  {
    id: 'py-essentials',
    code: 'PCAP Python',
    title: 'Python Essentials 1 (Basics)',
    track: 'Programming',
    level: 'Beginner',
    netacadUrl: 'https://skillsforall.com/course/python-essentials-1',
    enrolled: false,
    totalModules: 4,
    completedModules: 0,
    quizzesCompleted: 0,
    quizzesTotal: 4,
    labsCompleted: 0,
    labsTotal: 10,
    courseFeedbackCompleted: false,
    finalExamPassed: false,
    letterOfMeritQualified: false,
    digitalBadgeEarned: false,
    targetCompletionDate: '2026-12-20',
    bannerImage: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1200&q=80',
    modules: []
  }
];

export const INITIAL_TASKS = [
  {
    id: 'task-1',
    courseId: 'ccna-itn',
    courseName: 'CCNA 1 (ITN)',
    title: 'Module 14 Quiz: Transport Layer Protocol Check',
    type: 'quiz' as const,
    dueDate: '2026-10-14',
    priority: 'high' as const,
    status: 'pending' as const,
    estimatedMinutes: 25,
    directNetAcadUrl: 'https://www.netacad.com/courses/networking/ccna-introduction-networks#14.4',
    notes: 'Study TCP 3-way handshake sequence and port numbers (HTTP 80, HTTPS 443, DNS 53, SSH 22).'
  },
  {
    id: 'task-2',
    courseId: 'ccna-srwe',
    courseName: 'CCNA 2 (SRWE)',
    title: 'Packet Tracer 3.4.5: Router-on-a-Stick Inter-VLAN Configuration',
    type: 'packet_tracer' as const,
    dueDate: '2026-10-16',
    priority: 'critical' as const,
    status: 'in_progress' as const,
    estimatedMinutes: 45,
    directNetAcadUrl: 'https://www.netacad.com/courses/networking/ccna-switching-routing-wireless-essentials#3.4',
    notes: 'Remember encapsulation dot1Q <vlan-id> on subinterfaces before assigning IP address.'
  },
  {
    id: 'task-3',
    courseId: 'ccna-itn',
    courseName: 'CCNA 1 (ITN)',
    title: 'Packet Tracer 17.8.2: Skills Assessment Capstone (PTSA)',
    type: 'packet_tracer' as const,
    dueDate: '2026-10-20',
    priority: 'critical' as const,
    status: 'pending' as const,
    estimatedMinutes: 75,
    directNetAcadUrl: 'https://www.netacad.com/courses/networking/ccna-introduction-networks#17.8',
    notes: 'Required for course completion certificate! Minimum 80% passing score.'
  },
  {
    id: 'task-4',
    courseId: 'ccna-itn',
    courseName: 'CCNA 1 (ITN)',
    title: 'Submit NetAcad End-of-Course Student Feedback Survey',
    type: 'survey' as const,
    dueDate: '2026-10-22',
    priority: 'high' as const,
    status: 'pending' as const,
    estimatedMinutes: 10,
    directNetAcadUrl: 'https://www.netacad.com/portal/learning',
    notes: 'MANDATORY Cisco requirement before the Final Exam unlocks and before Certificate of Completion is issued.'
  },
  {
    id: 'task-5',
    courseId: 'ccna-itn',
    courseName: 'CCNA 1 (ITN)',
    title: 'CCNA 1 Official Final Exam (>=75% for Cisco Letter of Merit)',
    type: 'final_exam' as const,
    dueDate: '2026-10-24',
    priority: 'critical' as const,
    status: 'pending' as const,
    estimatedMinutes: 90,
    directNetAcadUrl: 'https://www.netacad.com/portal/learning',
    notes: 'Final step to earn Cisco Digital Badge on Credly and printable Certificate.'
  }
];

export const CORE_CISCO_TRANSCRIPTS = [
  {
    id: 'transcript-ipv4-subnetting',
    title: 'CCNA Subnetting & CIDR Magic Number Method',
    courseCode: 'CCNA 1 (ITN)',
    module: 'Module 8: Network Layer',
    videoLength: '14:20',
    content: `Welcome to this Cisco Networking Academy video lecture on Subnetting IPv4 Networks.
Today we will master the Magic Number method to quickly subnet in your head for the CCNA exam without binary conversions.
First, recall the default class boundaries: /8 has mask 255.0.0.0, /16 is 255.255.0.0, /24 is 255.255.255.0.
When you receive a prefix like 192.168.10.0/26, look at the interesting octet.
Since /26 is between /24 and /32, the interesting octet is the fourth octet.
In the fourth octet, /26 has 2 borrowed network bits: 11000000.
The value of the mask is 128 + 64 = 192.
To find the Magic Number, subtract the interesting octet mask value from 256:
256 - 192 = 64.
64 is your block size, your Magic Number!
That means every subnet increments by 64 in the fourth octet:
Subnet 0: 192.168.10.0
Subnet 1: 192.168.10.64
Subnet 2: 192.168.10.128
Subnet 3: 192.168.10.192
For any subnet, the first usable IP is Network ID + 1.
The Broadcast address is the address immediately preceding the next subnet ID.
The last usable IP is Broadcast - 1.
For example, for Subnet 1 (192.168.10.64/26):
Network Address: 192.168.10.64
First Usable Host: 192.168.10.65
Last Usable Host: 192.168.10.126
Broadcast Address: 192.168.10.127
Next Subnet starts at 192.168.10.128.
Practice this formula: 256 minus mask octet equals block size. It works for /25 through /30 as well as /17 through /22 in the third octet.
In Packet Tracer lab 8.5, you will configure router interface G0/0/0 with the first usable IP of subnet 1 and PC1 with the last usable IP. Remember to set the Default Gateway on PC1 to the router G0/0/0 IP!`
  },
  {
    id: 'transcript-router-on-a-stick',
    title: 'Inter-VLAN Routing with Router-on-a-Stick (802.1Q)',
    courseCode: 'CCNA 2 (SRWE)',
    module: 'Module 3: VLANs',
    videoLength: '12:45',
    content: `In this NetAcad video, we demonstrate configuring Router-on-a-Stick inter-VLAN routing using Cisco IOS CLI.
When separate VLANs like VLAN 10 (Faculty) and VLAN 20 (Students) exist on Switch 1, they cannot communicate at Layer 2 because they are distinct broadcast domains.
To route between them using a single physical cable connected to Router 1 G0/0/1:
Step 1: On Switch 1, configure the link to the router as an 802.1Q trunk.
Switch1(config)# interface FastEthernet 0/1
Switch1(config-if)# switchport mode trunk
Switch1(config-if)# no shutdown
Step 2: On Router 1, enable the physical interface without an IP address:
Router1(config)# interface GigabitEthernet 0/0/1
Router1(config-if)# no shutdown
Step 3: Create virtual subinterfaces for each VLAN:
Router1(config)# interface GigabitEthernet 0/0/1.10
Router1(config-subif)# encapsulation dot1Q 10
Router1(config-subif)# ip address 192.168.10.1 255.255.255.0
Router1(config)# interface GigabitEthernet 0/0/1.20
Router1(config-subif)# encapsulation dot1Q 20
Router1(config-subif)# ip address 192.168.20.1 255.255.255.0
Notice the critical order: you MUST enter 'encapsulation dot1Q <vlan-id>' BEFORE you can assign the IP address, or IOS will return an error stating that 802.1Q encapsulation is required first.
Step 4: Verify with 'show ip route' and 'show ip interface brief'. Both subinterfaces should show Status UP and Protocol UP.
Now, hosts in VLAN 10 with default gateway 192.168.10.1 can ping hosts in VLAN 20 with default gateway 192.168.20.1.`
  },
  {
    id: 'transcript-stp-bpdu',
    title: 'STP Root Bridge Election & Port States',
    courseCode: 'CCNA 2 (SRWE)',
    module: 'Module 5: Spanning Tree Protocol',
    videoLength: '15:10',
    content: `In redundant switched topologies, loops can cause broadcast storms, multiple frame transmission, and MAC database instability within seconds.
Spanning Tree Protocol (IEEE 802.1D and 802.1w Rapid STP) breaks loops by placing redundant ports into a blocking or discarding state.
How does the election process work?
Every switch exchanges Bridge Protocol Data Units (BPDUs) every 2 seconds by default.
The switch with the lowest Bridge ID (BID) is elected as the Root Bridge.
BID consists of:
1. Priority (4 bits, increments of 4096, default is 32768)
2. Extended System ID (12 bits, represents the VLAN number)
3. MAC address (48 bits, uniquely assigned to the switch backplane)
To force Switch 1 to be the Root Bridge for VLAN 10:
Switch1(config)# spanning-tree vlan 10 priority 4096
Or using the Cisco macro:
Switch1(config)# spanning-tree vlan 10 root primary
Once the Root Bridge is chosen:
All ports on the Root Bridge are Designated Ports and in Forwarding state.
Non-root switches find their single Root Port—the port with the lowest Root Path Cost back to the Root Bridge.
On each remaining segment, one port is Designated (Forwarding) and the other is Alternate/Backup (Blocking).
Use 'show spanning-tree' to see the BID, Root BID, port role, and port status.`
  }
];
