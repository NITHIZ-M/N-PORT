import math

def sakura_petal(angle_offset_deg, num_points_per_petal=12):
    points = []
    # A single petal spans from -36 deg to +36 deg
    # The cleft is at 0 deg
    for i in range(num_points_per_petal):
        t = i / float(num_points_per_petal)
        # Angle from -36 to 36
        local_angle = -36 + t * 72
        
        abs_l = abs(local_angle)
        if abs_l < 5:
            r = 0.45 + 0.55 * (abs_l / 5.0)
        elif abs_l < 25:
            r = 1.0
        else:
            u = (36.0 - abs_l) / 11.0 
            r = 0.1 + 0.9 * u
            
        global_angle = local_angle + angle_offset_deg
        rad = math.radians(global_angle - 90) # -90 to start at top
        
        x = 50 + 50 * r * math.cos(rad)
        y = 50 + 50 * r * math.sin(rad)
        points.append(f"{x:.1f}% {y:.1f}%")
    return points

all_points = []
for p in range(5):
    all_points.extend(sakura_petal(p * 72))

print("clip-path: polygon(\n  " + ", ".join(all_points) + "\n);")
